"use client";

import { Suspense, useEffect, useState } from "react";
import { axiosbaseurl } from "../../axios/axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

//lll`

function VerifyPaymentContent() {
  const [status, setStatus] = useState("Verifying payment...");
  const [tryAgain, setTryAgain] = useState(false);

  const searchParams = useSearchParams();
  const tx = searchParams.get("tx");

  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    if (!tx) {
      setStatus("Invalid payment request ❌");
      setTryAgain(true);
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await axiosbaseurl.get("/payment/verify", {
          params: { tx },
          withCredentials: true,
        });

        console.log(res.data);

        setStatus(res.data.message || "Payment verified ✅");

        // No pending payment
        if (res.data.message === "No pending payment found") {
          setTryAgain(true);
          return;
        }

        // Update auth state
        if (res.data.user) {
          login(res.data.user);
        }

        // Redirect
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
  }, [tx, login, router]);

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

export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPaymentContent />
    </Suspense>
  );
}