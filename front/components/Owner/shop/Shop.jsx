"use client";

import React, { useEffect, useState } from "react";
import { axiosbaseurl } from "../../../axios/axios";

function Shop() {
  const [shopName, setShopName] = useState("");
  const [location, setLocation] = useState("");

  const [branchName, setBranchName] = useState("");
  const [branchLocation, setBranchLocation] = useState("");

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch shops
  const fetchShops = async () => {
    try {
      const res = await axiosbaseurl.get("/owner/getShops");
      if (res.data.length > 0) {
        setShop(res.data[0]); // assuming one shop per owner
      } else {
        setShop(null);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // 🏬 Create Shop
  const handleCreateShop = async () => {
    try {
      await axiosbaseurl.post("/owner/createShop", {
        name: shopName,
        location,
      });
      console.log("Shop created successfully");

      setShopName("");
      setLocation("");
     
      fetchShops(); // refresh UI
    } catch (error) {
      console.error("Error creating shop:", error);
    }
  };

  // 🏪 Create Branch
  const handleCreateBranch = async () => {
    try {
      const res = await axiosbaseurl.post("/owner/createBranch", {
        name: branchName,
        location: branchLocation,
        shop_id: shop.shop_id,
      });
      console.log("Branch created successfully", res.data);
      setBranchName("");
      setBranchLocation("");

      fetchShops(); // refresh branches
    } catch (error) {
      console.error("Error creating branch:", error);
    }
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6 text-white">
      {/* 🥇 NO SHOP */}
      {!shop && (
        <div className="max-w-md mx-auto bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h2 className="text-xl font-semibold mb-4">Create Your Shop</h2>

          <input
            type="text"
            placeholder="Shop Name"
            className="w-full mb-4 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            className="w-full mb-4 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button
            onClick={handleCreateShop}
            className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-md"
          >
            Create Shop
          </button>
        </div>
      )}

      {/* 🥈 SHOP EXISTS */}
      {shop && (
        <div className="space-y-6">
          {/* 🏬 SHOP DETAILS */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-xl font-semibold">{shop.name}</h2>
            <p className="text-slate-400 text-sm mt-1">{shop.location}</p>
          </div>

          {/* 🏪 BRANCHES */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold mb-4">Branches</h3>

            {/* Existing branches */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {shop.branches?.map((branch) => (
                <div
                  key={branch.branch_id}
                  className="p-4 bg-slate-800 rounded-lg border border-slate-700"
                >
                  <p className="font-medium">{branch.name}</p>
                  <p className="text-sm text-slate-400">
                    {branch.location}
                  </p>
                </div>
              ))}
            </div>

            {/* Add branch */}
            <div className="border-t border-slate-700 pt-4">
              <h4 className="mb-2">Add Branch</h4>

              <input
                type="text"
                placeholder="Branch Name"
                className="w-full mb-3 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Location"
                className="w-full mb-3 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md"
                value={branchLocation}
                onChange={(e) => setBranchLocation(e.target.value)}
              />

              <button
                onClick={handleCreateBranch}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
              >
                + Add Branch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop;