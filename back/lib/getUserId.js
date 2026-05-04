import crypto from "crypto";
import { prisma } from "./prisma.js";

// 🔐 same hash function used everywhere
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const getUserFromRefreshToken = async (req) => {
  // ✅ get token from cookies
  const refreshToken = req;

  if (!refreshToken) {
    return { error: "Refresh token required" };
  }

  try {
    // 🔐 hash incoming token
    const hashedToken = hashToken(refreshToken);

    // 🔎 find session
    const session = await prisma.session.findFirst({
      where: {
        refreshToken: hashedToken,
      },
    });

    if (!session) {
      return { error: "Invalid session" };
    }

    // ✅ return user id
    return { user_id: session.user_id };

  } catch (error) {
    console.error("Error:", error);
    return { error: "Server error" };
  }
};