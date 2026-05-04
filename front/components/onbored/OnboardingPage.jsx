"use client";

import { useState } from "react";
import { axiosbaseurl } from "@/axios/axios";
import { useAuth } from "../../context/AuthContext";
import {
  CheckCircle,
  CreditCard,
  Smartphone,
  Landmark,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function PricingPlans() {
  const [selectedPlan, setSelectedPlan] = useState({
    name: "",
    price: "",
  });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");
 
 const { user } = useAuth();
 console.log("Current user:", user);
  const plans = [
    {
      name: "Starter",
      price: "99",
      period: "/month",
      color: "from-blue-500 to-cyan-500",
      popular: false,
      features: [
        "1 Store Access",
        "Basic Reports",
        "Customer Management",
        "Telegram Support",
      ],
      payment: "Pay with Chapa",
    },
    {
      name: "Growth",
      price: "299",
      period: "/month",
      color: "from-purple-500 to-pink-500",
      popular: true,
      features: [
        "3 Stores Access",
        "Advanced Reports",
        "Inventory Alerts",
        "Priority Support",
      ],
      payment: "Pay with Chapa",
    },
    {
      name: "Business",
      price: "599",
      period: "/month",
      color: "from-orange-500 to-red-500",
      popular: false,
      features: [
        "Unlimited Stores",
        "AI Insights",
        "Full Analytics",
        "VIP Support",
      ],
      payment: "Pay with Chapa",
    },
  ];

  const handlePayment = async (plan) => {
    setSelectedPlan({
      name: plan.name,
      price: plan.price
    });
    await axiosbaseurl.post("/payment/pay", {
      plan: plan.name,
      price: plan.price,
      first_name: user?.first_name,
      father_name: user?.father_name,
      grandfather_name: user?.grandfather_name,
      email: user?.email,
    })
    .then((res) => {
      console.log("Payment response:", res.data);
       window.location.href = res.data.checkout_url; // Redirect to Chapa checkout

    });
  };

  return (
    <section className="w-full py-20 px-6 bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm mb-5">
          <Sparkles size={16} />
          Flexible Pricing
        </span>

        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          Choose Your Perfect Plan
        </h2>

        <p className="text-slate-400 max-w-2xl mx-auto mb-14 text-lg">
          Affordable plans designed for Ethiopian businesses. Secure payments
          powered by Chapa.
        </p>

        {/* Chapa Logo */}
        {/* <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl px-6 py-4 shadow-lg">
            <Image
              src="/chapa.png"
              alt="Chapa Payment"
              width={140}
              height={50}
              className="object-contain"
            />
          </div>
        </div> */}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:scale-105 transition-all duration-300 ${
                plan.popular ? "ring-2 ring-pink-500 shadow-2xl" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-6 bg-pink-500 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              )}

              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-6 mx-auto`}
              >
                <CreditCard />
              </div>

              <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>

              <div className="mb-6">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-slate-400 ml-1">Birr{plan.period}</span>
              </div>

              <ul className="space-y-3 text-left mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-green-400" size={18} />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Payment Method */}
              <div className="bg-slate-800 rounded-xl p-3 mb-5 flex items-center justify-center gap-2 text-sm text-slate-300">
                <ShieldCheck size={16} className="text-green-400" />
                {plan.payment}
              </div>

              <button
                onClick={() => handlePayment(plan)}
                className={`w-full py-3 rounded-xl font-semibold bg-gradient-to-r ${plan.color} hover:opacity-90 transition`}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-slate-500 text-sm mt-10">
          Secure payments powered by Chapa • Cancel anytime
        </p>
      </div>
    </section>
  );
}