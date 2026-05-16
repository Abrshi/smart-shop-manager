"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function CashierLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Scanner", path: "/cashier" },
    { name: "Caret", path: "/cashier/caret" },
    { name: "Receipts", path: "/cashier/receipts" },
    { name: "Products", path: "/cashier/products" },
    { name: "Story", path: "/cashier/story" },
    
  ];

  

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 backdrop-blur bg-slate-900/70 sticky top-0 z-50">
        
        {/* LEFT NAV */}
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`relative text-sm font-medium transition 
              ${
                pathname === item.path
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {item.name}

              {/* active underline */}
              {pathname === item.path && (
                <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-blue-500 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          
          {/* Settings + Billing */}
          <Link href="/admin/settings" className="text-slate-400 hover:text-white text-sm">
            Settings
          </Link>

          <Link href="/admin/billing" className="text-slate-400 hover:text-white text-sm">
            Billing
          </Link>
 

          {/* User */}
          <div className="flex items-center gap-3 ml-2">
            <div className="text-sm text-slate-300">
              {user?.fullName || "User"}
            </div>

            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="bg-red-500 hover:bg-red-600 text-xs px-3 py-1.5 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="p-6">{children}</main>
    </div>
  );
}