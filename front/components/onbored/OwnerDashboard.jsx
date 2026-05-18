"use client";

import React, {
  useEffect,
  useState,
} from "react";

import { axiosbaseurl } from "@/axios/axios";

import {
  Store,
  Building2,
  Package,
  MapPin,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

export default function OwnerDashboard() {
  const [shops, setShops] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [openShops, setOpenShops] =
    useState({});

  const [openBranches, setOpenBranches] =
    useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res =
        await axiosbaseurl.get(
          "/owner/getOwnerShopsBranchesProducts"
        );

      setShops(
        res.data.data || []
      );
    } catch (error) {
      setError(
        error.response?.data
          ?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleShop = (
    shopId
  ) => {
    setOpenShops(
      (prev) => ({
        ...prev,
        [shopId]:
          !prev[shopId],
      })
    );
  };

  const toggleBranch = (
    branchId
  ) => {
    setOpenBranches(
      (prev) => ({
        ...prev,
        [branchId]:
          !prev[branchId],
      })
    );
  };

  if (loading) {
    return (
      <div className="text-white p-6">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-6">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen bg-transparent">

      <h1 className="text-3xl font-bold mb-6">
        Shop Dashboard
      </h1>

      <div className="space-y-5">
        {shops.map(
          (shop) => (
            <div
              key={
                shop.shop_id
              }
              className="border border-white/20 rounded-xl backdrop-blur-sm"
            >

              {/* Shop */}
              <div
                onClick={() =>
                  toggleShop(
                    shop.shop_id
                  )
                }
                className="p-5 cursor-pointer flex justify-between items-center"
              >
                <div className="flex gap-3 items-center">
                  <Store />

                  <div>
                    <h2 className="font-bold text-xl">
                      {
                        shop.name
                      }
                    </h2>

                    <p className="text-white/70 text-sm flex gap-1 items-center">
                      <MapPin size={14} />
                      {
                        shop.location
                      }
                    </p>
                  </div>
                </div>

                {openShops[
                  shop.shop_id
                ] ? (
                  <ChevronDown />
                ) : (
                  <ChevronRight />
                )}
              </div>

              {/* Branches */}
              {openShops[
                shop.shop_id
              ] && (
                <div className="px-5 pb-5 space-y-4">

                  {shop.branches.map(
                    (
                      branch
                    ) => (
                      <div
                        key={
                          branch.branch_id
                        }
                        className="border border-white/10 rounded-lg"
                      >

                        {/* Branch */}
                        <div
                          onClick={() =>
                            toggleBranch(
                              branch.branch_id
                            )
                          }
                          className="p-4 cursor-pointer flex justify-between items-center"
                        >
                          <div className="flex gap-3 items-center">
                            <Building2 size={18} />

                            <div>
                              <h3 className="font-semibold">
                                {
                                  branch.name
                                }
                              </h3>

                              <p className="text-sm text-white/70">
                                {
                                  branch
                                    .products
                                    .length
                                }{" "}
                                Products
                              </p>
                            </div>
                          </div>

                          {openBranches[
                            branch
                              .branch_id
                          ] ? (
                            <ChevronDown />
                          ) : (
                            <ChevronRight />
                          )}
                        </div>

                        {/* Products */}
                        {openBranches[
                          branch
                            .branch_id
                        ] && (
                          <div className="p-4 grid md:grid-cols-2 xl:grid-cols-3 gap-4">

                            {branch
                              .products
                              .length ===
                            0 ? (
                              <p className="text-white/50">
                                No products
                              </p>
                            ) : (
                              branch.products.map(
                                (
                                  product
                                ) => (
                                  <div
                                    key={
                                      product.product_id
                                    }
                                    className="border border-white/10 rounded-xl p-4"
                                  >

                                    {product.image && (
                                      <img
                                        src={
                                          product.image
                                        }
                                        alt={
                                          product.name
                                        }
                                        className="w-50 h-auto object-cover rounded-lg mb-3"
                                      />
                                    )}

                                    <div className="flex gap-2 items-center mb-2">
                                      <Package size={18} />

                                      <h4 className="font-semibold">
                                        {
                                          product.name
                                        }
                                      </h4>
                                    </div>

                                    <p className="text-sm text-white/70">
                                      Price:{" "}
                                      ETB{" "}
                                      {
                                        product.price
                                      }
                                    </p>

                                    <p className="text-sm text-white/70">
                                      Quantity:{" "}
                                      {
                                        product.quantity
                                      }
                                    </p>

                                    <p className="text-sm text-white/70">
                                      Brand:{" "}
                                      {
                                        product.brand
                                      }
                                    </p>

                                    <p className="text-sm text-white/70">
                                      Type:{" "}
                                      {
                                        product.type
                                      }
                                    </p>

                                    {product.quantity <=
                                      product.minStock && (
                                      <div className="flex items-center gap-2 mt-3 text-yellow-400">
                                        <AlertTriangle size={16} />
                                        Low Stock
                                      </div>
                                    )}

                                  </div>
                                )
                              )
                            )}

                          </div>
                        )}

                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          )
        )}
      </div>

    </div>
  );
}