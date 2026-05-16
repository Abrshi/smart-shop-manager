"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { ScanBarcode, Mail, Lock, Sparkles, Phone } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { axiosbaseurl } from "../../axios/axios";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [signup, setSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (signup) {
        // Sign up API call
        const res = await axiosbaseurl.post("/auth/signup", formData);
        setSignup(false); // switch to login after signup
      } else {
        // Login API call
       const res = await axiosbaseurl.post("/auth/signin", {
          email: formData.email,
          password: formData.password,
        });
        await login(res.data.user); // Update context with user data
        if (res.data.user.role === "ADMIN") {
          router.push("/admin");
        } else if (res.data.user.role === "OWNER") {
          router.push("/owner");
        }else if (res.data.user.role === "ONBORED") {
          router.push("/onbored");
        }else if (res.data.user.role === "CASHIER") {
          router.push("/cashier");
        }else {
          router.push("/"); 
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

//   document.title = signup ? "Sign Up - SmartPOS" : "Sign In - SmartPOS";

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
            <ScanBarcode className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">SmartPOS</span>
        </div>

        <div className="relative space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
            <Sparkles className="h-3 w-3" />
            Built for Ethiopian shops
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Run your shop with one dashboard.
          </h1>

          <p className="text-white/80">
            Fast sales, inventory tracking, and simple management.
          </p>
        </div>

        <p className="text-xs text-white/60">© 2026 SmartPOS</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white">
              <ScanBarcode className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">SmartPOS</span>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-3xl font-bold">
              {signup ? "Create account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {signup
                ? "Create your shop account"
                : "Sign in to manage your shop"}
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* NAME (only signup) */}
            {signup && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-11 rounded-lg border pl-10 pr-4 outline-none focus:ring-2 focus:ring-slate-700"
                  />
                </div>
              </div>
            )}

            {/* PHONE (only signup) */}
            {signup && (
              <div className="space-y-2">
                <label htmlFor="phone_number" className="text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="phone_number"
                    id="phone_number"
                    placeholder="Your phone number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full h-11 rounded-lg border pl-10 pr-4 outline-none focus:ring-2 focus:ring-slate-700"
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@shop.et"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-11 rounded-lg border pl-10 pr-4 outline-none focus:ring-2 focus:ring-slate-700"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-11 rounded-lg border pl-10 pr-4 outline-none focus:ring-2 focus:ring-slate-700"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-gradient-hero text-white font-medium hover:opacity-95 transition disabled:opacity-50"
            >
              {signup ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* TOGGLE */}
          <div className="text-center text-sm text-gray-500">
            {signup ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setSignup(false)}
                  className="font-medium text-slate-900 hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Need an account?{" "}
                <button
                  onClick={() => setSignup(true)}
                  className="font-medium text-slate-900 hover:underline"
                >
                  Create one
                </button>
              </>
            )}
          </div>

          <p className="text-center text-xs text-gray-500">
            <Link href="/">← Back to dashboard</Link>
          </p>

        </div>
      </div>
    </div>
  );
}