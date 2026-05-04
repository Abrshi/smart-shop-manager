"use client";

import { useEffect, useState } from "react";
import { axiosbaseurl } from "../../axios/axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext"; // 👈 ADD THIS

export default function VerifyPaymentPage() {
  const [status, setStatus] = useState("Verifying payment...");
  const [tryAgain, setTryAgain] = useState(false);

  const searchParams = useSearchParams();
  const tx = searchParams.get("tx");

  const router = useRouter();
  const { login } = useAuth(); // 👈 GET LOGIN FUNCTION

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axiosbaseurl.get("/payment/verify", {
          params: { tx },
          withCredentials: true,
        });

        console.log(res.data);

        setStatus(res.data.message || "Payment verified ✅");

        // ❗ CASE: no pending payment
        if (res.data.message === "No pending payment found") {
          setTryAgain(true);
          return;
        }

        // 🔥 IMPORTANT: update frontend user immediately
        if (res.data.user) {
          login(res.data.user); // ✅ THIS FIXES YOUR PROBLEM
        }

        // redirect after short delay
        setTimeout(() => {
          router.push("/owner");
        }, 1500);

      } catch (err) {
        console.log(err);
        setStatus("Payment verification failed ❌");
        setTryAgain(true);
      }
    };

    verifyPayment();
  }, [tx]);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-xl font-semibold gap-4">
      <div>{status}</div>

      {tryAgain && (
        <button
          onClick={() => window.location.reload()}
          className="bg-amber-400 text-white py-2 px-4 rounded hover:bg-amber-600 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
