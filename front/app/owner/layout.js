"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function OwnerLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/owner" },
    { name: "Sales", path: "/owner/sales" },
    { name: "Employees", path: "/owner/employees" },
    { name: "Customers", path: "/owner/customers" },
    { name: "Reports", path: "/owner/reports" },
    { name: "Shop", path: "/owner/shop" },
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
          <Link href="/owner/settings" className="text-slate-400 hover:text-white text-sm">
            Settings
          </Link>

          <Link href="/owner/billing" className="text-slate-400 hover:text-white text-sm">
            Billing
          </Link>

          {/* Role Switch */}
          <select
            onChange={(e) => handleRoleSwitch(e.target.value)}
            className="bg-slate-800 text-sm px-3 py-1.5 rounded-md border border-slate-700 focus:outline-none"
          >
            <option value="owner">Owner Panel</option>
            <option value="admin">Admin Panel</option>
            <option value="shopkeeper">Shopkeeper Panel</option>
          </select>

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