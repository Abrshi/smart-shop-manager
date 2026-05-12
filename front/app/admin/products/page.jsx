"use client";

import AddExisting from "@/components/Admin/AddExisting";
import AddProduct from "@/components/Admin/AddProduct";
import GetProducts from "@/components/Admin/GetProducts";
import LowStock from "@/components/Admin/LowStock";
import React, { useState } from "react";

function ProductManager() {
  const [activeTab, setActiveTab] = useState("get-products");

  const tabs = [
    {
      id: "get-products",
      label: "Get Products",
    },
    {
      id: "add-new",
      label: "Add New",
    },
    {
      id: "add-existing",
      label: "Add Existing",
    },
    {
      id: "low-stock",
      label: "Low Stock",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* CONTAINER */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        
        {/* HEADER */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-wide">
            Product Management
          </h1>

          <p className="text-zinc-400 mt-3 text-sm md:text-base max-w-2xl">
            Manage inventory like a futuristic cargo control system.
          </p>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* SIDEBAR / TABS */}
          <div className="lg:w-[260px] w-full">
            
            {/* MOBILE SCROLL */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap
                    px-5 py-4
                    rounded-2xl
                    border
                    transition-all duration-300
                    text-sm md:text-base
                    font-medium

                    ${
                      activeTab === tab.id
                        ? "bg-white text-black border-white"
                        : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl min-h-[600px]">
              
              {activeTab === "get-products" && (
                <GetProducts />
              )}

              {activeTab === "add-new" && (
                <AddProduct />
              )}

              {activeTab === "add-existing" && (
                <AddExisting />
              )}

              {activeTab === "low-stock" && (
                <LowStock />
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductManager;