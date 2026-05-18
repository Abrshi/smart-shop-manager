"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  TrendingUp,
  ShoppingCart,
  Wallet,
  Package,
  RefreshCcw,
  Activity,
  ArrowUpRight,
  Boxes,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { axiosbaseurl } from "@/axios/axios";

function AdminDashboard() {
  const [analytics, setAnalytics] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // FETCH DATA
  const getAnalytics =
    async () => {
      try {
        setLoading(true);

        const response =
          await axiosbaseurl.get(
            "/admin/analyticsForSoldItems",
            {
              withCredentials:
                true,
            }
          );

        if (
          response.data.success
        ) {
          setAnalytics(
            response.data
              .analytics || []
          );
        }
      } catch (err) {
        console.log(err);

        setError(
          "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    getAnalytics();
  }, []);

  // TOTALS
  const totalRevenue =
    useMemo(() => {
      return analytics.reduce(
        (sum, item) =>
          sum +
          Number(
            item.totalRevenue || 0
          ),
        0
      );
    }, [analytics]);

  const totalProductsSold =
    useMemo(() => {
      return analytics.reduce(
        (sum, item) =>
          sum +
          Number(
            item.quantitySold || 0
          ),
        0
      );
    }, [analytics]);

  const totalStock =
    useMemo(() => {
      return analytics.reduce(
        (sum, item) =>
          sum +
          Number(
            item.currentStock || 0
          ),
        0
      );
    }, [analytics]);

  const topProducts =
    [...analytics]
      .sort(
        (a, b) =>
          b.totalRevenue -
          a.totalRevenue
      )
      .slice(0, 5);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-5 md:p-8 text-white">
        <div className="animate-pulse space-y-6">
          <div className="h-12 w-72 rounded-2xl bg-zinc-800" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-40 rounded-[30px] bg-zinc-900"
                />
              )
            )}
          </div>

          <div className="h-[420px] rounded-[35px] bg-zinc-900" />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-32 rounded-[30px] bg-zinc-900"
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-5">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl p-8">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* BACKGROUND EFFECT */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600/20 blur-[120px]" />

        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-cyan-500/20 blur-[120px]" />
      </div>

      <div className="p-4 md:p-8">
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">
          <div>
            <p className="text-zinc-400 text-sm tracking-[4px] uppercase">
              Business Overview
            </p>

            <h1 className="text-4xl md:text-6xl font-black mt-2">
              Admin Dashboard
            </h1>

            <p className="text-zinc-500 mt-3 text-sm md:text-base">
              Track sales, products,
              revenue and live
              business performance.
            </p>
          </div>

          <button
            onClick={
              getAnalytics
            }
            className="group bg-white text-black px-6 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all duration-300"
          >
            <RefreshCcw
              size={18}
              className="group-hover:rotate-180 transition-all duration-500"
            />

            Refresh Data
          </button>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* REVENUE */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl" />

            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center">
                <Wallet size={24} />
              </div>

              <div className="flex items-center gap-1 text-green-400 text-sm font-bold">
                <ArrowUpRight size={16} />
                Revenue
              </div>
            </div>

            <h2 className="text-4xl font-black mt-8">
              ETB{" "}
              {totalRevenue.toLocaleString()}
            </h2>

            <p className="text-zinc-500 mt-2">
              Total earnings
            </p>
          </div>

          {/* SALES */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-purple-700 to-purple-950 p-6">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <ShoppingCart
                  size={24}
                />
              </div>

              <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-black">
                SALES
              </span>
            </div>

            <h2 className="text-5xl font-black mt-8">
              {
                totalProductsSold
              }
            </h2>

            <p className="text-white/70 mt-2">
              Products sold
            </p>
          </div>

          {/* STOCK */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-cyan-700 to-cyan-950 p-6">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <Boxes size={24} />
              </div>

              <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-black">
                STOCK
              </span>
            </div>

            <h2 className="text-5xl font-black mt-8">
              {totalStock}
            </h2>

            <p className="text-white/70 mt-2">
              Available stock
            </p>
          </div>

          {/* PRODUCTS */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-orange-600 to-red-900 p-6">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <Package size={24} />
              </div>

              <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-black">
                PRODUCTS
              </span>
            </div>

            <h2 className="text-5xl font-black mt-8">
              {
                analytics.length
              }
            </h2>

            <p className="text-white/70 mt-2">
              Active products
            </p>
          </div>
        </div>

        {/* CHART + LIVE */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-5 mt-8">
          {/* CHART */}
          <div className="2xl:col-span-2 bg-zinc-950 border border-white/10 rounded-[35px] p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black">
                  Revenue Analytics
                </h2>

                <p className="text-zinc-500 mt-2">
                  Top performing
                  products
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                <TrendingUp
                  size={24}
                />
              </div>
            </div>

            <div className="h-[350px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={
                    topProducts
                  }
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                  />

                  <XAxis
                    dataKey="productName"
                    stroke="#71717a"
                  />

                  <YAxis
                    stroke="#71717a"
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "#09090b",
                      border:
                        "1px solid #27272a",
                      borderRadius:
                        "16px",
                      color:
                        "#fff",
                    }}
                  />

                  <Bar
                    dataKey="totalRevenue"
                    radius={[
                      10,
                      10,
                      0,
                      0,
                    ]}
                    fill="#8b5cf6"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LIVE PANEL */}
          <div className="bg-zinc-950 border border-white/10 rounded-[35px] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Live Activity
                </h2>

                <p className="text-zinc-500 text-sm mt-1">
                  Real-time insights
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400">
                <Activity size={22} />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {topProducts.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={index}
                    className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">
                          {
                            item.productName
                          }
                        </h3>

                        <p className="text-zinc-500 text-sm mt-1">
                          Sold{" "}
                          {
                            item.quantitySold
                          }{" "}
                          items
                        </p>
                      </div>

                      <div className="text-right">
                        <h2 className="font-black text-xl text-green-400">
                          ETB{" "}
                          {Number(
                            item.totalRevenue
                          ).toLocaleString()}
                        </h2>

                        <p className="text-zinc-500 text-xs">
                          Revenue
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* PRODUCTS TABLE */}
        <div className="mt-8 bg-zinc-950 border border-white/10 rounded-[35px] overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black">
                Product Performance
              </h2>

              <p className="text-zinc-500 mt-2">
                Detailed sales
                analytics
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="text-left border-b border-white/10 text-zinc-500 text-sm">
                  <th className="p-5">
                    Product
                  </th>
                  <th className="p-5">
                    Revenue
                  </th>
                  <th className="p-5">
                    Sold
                  </th>
                  <th className="p-5">
                    Stock
                  </th>
                  <th className="p-5">
                    Price
                  </th>
                  <th className="p-5">
                    Avg Price
                  </th>
                </tr>
              </thead>

              <tbody>
                {topProducts.map(
                  (
                    item,
                    index
                  ) => (
                    <tr
                      key={index}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-all"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center font-black">
                            {index + 1}
                          </div>

                          <div>
                            <h2 className="font-bold">
                              {
                                item.productName
                              }
                            </h2>

                            <p className="text-zinc-500 text-sm">
                              ID:{" "}
                              {
                                item.productId
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-5 font-black text-green-400">
                        ETB{" "}
                        {Number(
                          item.totalRevenue
                        ).toLocaleString()}
                      </td>

                      <td className="p-5">
                        {
                          item.quantitySold
                        }
                      </td>

                      <td className="p-5">
                        {
                          item.currentStock
                        }
                      </td>

                      <td className="p-5">
                        ETB{" "}
                        {item.price}
                      </td>

                      <td className="p-5">
                        ETB{" "}
                        {
                          item.avgSellingPrice
                        }
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;