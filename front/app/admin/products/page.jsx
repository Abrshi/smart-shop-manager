"use client";

import AddExisting from "@/components/Admin/AddExisting";
import AddProduct from "@/components/Admin/AddProduct";
import GetProducts from "@/components/Admin/GetProducts";
import React, { useState } from "react";

// IMPORT COMPONENTS

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
      id: "edit-product",
      label: "Edit Product",
    },
    {
      id: "delete-product",
      label: "Delete Product",
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-wide">
          Product Management
        </h1>

        <p className="text-zinc-400 mt-2">
          Manage inventory like a control panel from a sci-fi cargo ship 🚀
        </p>
      </div>

      {/* TOGGLER */}
      <div className="flex flex-wrap gap-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-5 py-3 rounded-2xl transition-all duration-300 border
              
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

      {/* CONTENT */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
         
          {activeTab === "get-products" && (
          <GetProducts />
        )}
        
          {activeTab === "add-new" && (
            <AddProduct />
          )}
          {activeTab === "add-existing" && (
          <AddExisting />
        )}


        {/* 

        
        {activeTab === "delete-product" && (
          <DeleteProduct />
        )} */}

      </div>
    </div>
  );
}

export default ProductManager;