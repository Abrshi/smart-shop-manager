import { getUserFromRefreshToken } from "../../lib/getUserId.js";
import { prisma } from "../../lib/prisma.js";
import axios from "axios";
import { reAuth, accessCookieOptions, refreshCookieOptions } from "../auth/auth.controller.js";
export const payment = async (req, res) => {
  const { price, first_name, father_name, grandfather_name, email } = req.body;

  try {
    const tx_ref = `tx-${Date.now()}`;

    const chapaResponse = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: parseFloat(price),
        currency: "ETB",
        first_name,
        last_name: `${father_name} ${grandfather_name}`,
        email,
        return_url: "http://localhost:3000/verify-payment",
        tx_ref,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const userid = await getUserFromRefreshToken(req.cookies.refreshToken);

    if (!userid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await prisma.payment.create({
      data: {
        user_id: userid.user_id,
        amount: Number(price),
        method: "chapa",
        status: "pending",
        transaction_id: tx_ref,
      },
    });

    return res.status(200).json({
      success: true,
      checkout_url: chapaResponse.data.data.checkout_url,
    });

  } catch (err) {
    console.log("Payment Error:", err.response?.data || err.message);
    console.error(err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message: "Payment failed",
    });
  }
};

export const verifyPayment = async (req, res) => {
  const userid = await getUserFromRefreshToken(req.cookies.refreshToken);

  if (!userid) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    // 1. Check pending payment
    const pendingPayment = await prisma.payment.findFirst({
  where: {
    user_id: userid.user_id,
    status: "pending",
  }
});

    if (!pendingPayment) {
      return res.status(200).json({
        success: false,
        message: "No pending payment found",
      });
    }

    const tx_ref = pendingPayment.transaction_id;

    // 2. Verify with Chapa
    const chapaResponse = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    // 3. If success → update DB + reAuth
    if (
      chapaResponse.data.status === "success" &&
      chapaResponse.data.data.status === "success"
    ) {
      // ✅ update payment
      await prisma.payment.updateMany({
        where: {
          transaction_id: tx_ref,
        },
        data: {
          status: "success",
        },
      });
      // ✅ update user (FIXED: use update not updateMany)
      const updatedUser = await prisma.user.update({
        where: {
          user_id: userid.user_id,
        },
        data: {
          role: "OWNER",
          account_status: "ACTIVE",
        },
      });

      // 🔥 RE-AUTH (VERY IMPORTANT)
      const authData = await reAuth(req.cookies.refreshToken);

      if (authData.error) {
        return res.status(401).json({ error: authData.error });
      }

      // ✅ send updated cookies + user
      return res
        .cookie("accessToken", authData.accessToken, accessCookieOptions)
        .cookie("refreshToken", authData.refreshToken, refreshCookieOptions)
        .json({
          success: true,
          message: "Payment verified ✅",
          user: authData.user, // 🔥 frontend will use this
        });
    }

    // ❗ if not successful
    return res.status(200).json({
      success: false,
      message: "Payment not completed yet",
    });

  } catch (err) {
    console.error("Verify Payment Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};