"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { axiosbaseurl } from "@/axios/axios";

import {
  CalendarDays,
  ShoppingBag,
  Wallet,
  X,
  ChevronRight,
  Package2,
} from "lucide-react";

function Recent() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("today");

  const [selectedItems, setSelectedItems] =
    useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [saleLoading, setSaleLoading] =
    useState(false);

  // FETCH SALES
  const getRecentSales = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await axiosbaseurl.get(
          "/cashier/recent",
          {
            withCredentials: true,
          }
        );

      if (response.data.success) {
        setSales(
          response.data.data || []
        );
      }
    } catch (err) {
      console.error(
        "RECENT SALES ERROR:",
        err
      );

      setError(
        "Failed to load sales"
      );
    } finally {
      setLoading(false);
    }
  };

  // FETCH SALE ITEMS
  const handleViewSale =
    async (saleId) => {
      try {
        setSaleLoading(true);

        const response =
          await axiosbaseurl.get(
            `/cashier/sale-items/${saleId}`,
            {
              withCredentials:
                true,
            }
          );

        if (
          response.data.success
        ) {
          setSelectedItems(
            response.data.data ||
              []
          );

          setShowModal(true);
        }
      } catch (error) {
        console.error(
          "SALE ITEMS ERROR:",
          error
        );
      } finally {
        setSaleLoading(false);
      }
    };

  useEffect(() => {
    getRecentSales();
  }, []);

  // FILTER SALES
  const filteredSales =
    useMemo(() => {
      const now = new Date();

      return sales.filter(
        (sale) => {
          const saleDate =
            new Date(
              sale.created_at
            );

          switch (
            filter
          ) {
            case "today":
              return (
                saleDate.toDateString() ===
                now.toDateString()
              );

            case "week":
              const weekAgo =
                new Date();

              weekAgo.setDate(
                now.getDate() - 7
              );

              return (
                saleDate >=
                weekAgo
              );

            case "month":
              return (
                saleDate.getMonth() ===
                  now.getMonth() &&
                saleDate.getFullYear() ===
                  now.getFullYear()
              );

            default:
              return true;
          }
        }
      );
    }, [sales, filter]);

  const totalAmount =
    filteredSales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.total || 0
        ),
      0
    );

  const filters = [
    {
      key: "today",
      label: "Today",
    },
    {
      key: "week",
      label: "Week",
    },
    {
      key: "month",
      label: "Month",
    },
    {
      key: "all",
      label: "All",
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded-full"></div>

          <div className="grid grid-cols-2 gap-4">
            <div className="h-28 bg-gray-100 rounded-3xl"></div>

            <div className="h-28 bg-gray-100 rounded-3xl"></div>
          </div>

          <div className="space-y-3">
            <div className="h-24 bg-gray-100 rounded-3xl"></div>

            <div className="h-24 bg-gray-100 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-[32px] border border-red-100 p-6 shadow-sm">
        <p className="text-red-500 font-medium">
          {error}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* TOP */}
        <div className="relative p-6 md:p-8 border-b border-gray-100">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gray-100 rounded-full blur-3xl opacity-40"></div>

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg">
                  <ShoppingBag
                    size={22}
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    Recent Sales
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Monitor all
                    recent
                    transactions
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black text-white px-5 py-4 rounded-3xl min-w-[130px]">
              <p className="text-xs opacity-70">
                Total Sales
              </p>

              <h3 className="text-3xl font-black mt-1">
                {
                  filteredSales.length
                }
              </h3>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 rounded-[28px] p-5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl  flex items-center justify-center shadow-sm text-black">
                  <Wallet size={20} />
                </div>

                <span className="text-xs font-medium px-3 py-1 rounded-full text-black">
                  Revenue
                </span>
              </div>

              <h3 className="text-3xl font-black mt-5 text-black ">
                ETB{" "}
                {totalAmount.toLocaleString()}
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Total earnings
              </p>
            </div>

            <div className="bg-black text-white rounded-[28px] p-5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Package2
                    size={20}
                  />
                </div>

                <span className="text-xs font-medium bg-white text-black px-3 py-1 rounded-full">
                  Orders
                </span>
              </div>

              <h3 className="text-3xl font-black mt-5">
                {
                  filteredSales.length
                }
              </h3>

              <p className="text-white/70 text-sm mt-1">
                Completed
                transactions
              </p>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-3 mt-7">
            {filters.map(
              (
                item
              ) => (
                <button
                  key={
                    item.key
                  }
                  onClick={() =>
                    setFilter(
                      item.key
                    )
                  }
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
                  ${
                    filter ===
                    item.key
                      ? "bg-black text-white shadow-lg scale-105"
                      : "bg-gray-100 hover:bg-gray-200 text-black"
                  }`}
                >
                  {
                    item.label
                  }
                </button>
              )
            )}
          </div>
        </div>

        {/* SALES LIST */}
        <div className="p-5 md:p-6 space-y-4">
          {filteredSales.length >
          0 ? (
            filteredSales.map(
              (
                sale
              ) => (
                <div
                  key={
                    sale.sale_id
                  }
                  onClick={() =>
                    handleViewSale(
                      sale.sale_id
                    )
                  }
                  className="group cursor-pointer border border-gray-100 hover:border-black/10 bg-gradient-to-br from-white to-gray-50 rounded-[30px] p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
                        <ShoppingBag
                          size={22}
                        />
                      </div>

                      <div>
                        <h3 className="font-black text-lg">
                          Sale #
                          {
                            sale.sale_id
                          }
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                          <CalendarDays
                            size={
                              15
                            }
                          />

                          <span>
                            {new Date(
                              sale.created_at
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <h3 className="text-2xl font-black">
                        ETB{" "}
                        {Number(
                          sale.total
                        ).toLocaleString()}
                      </h3>

                      <div className="flex items-center justify-end gap-1 text-sm font-semibold mt-2 text-black">
                        <span>
                          View
                        </span>

                        <ChevronRight
                          size={
                            16
                          }
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <ShoppingBag
                  size={32}
                />
              </div>

              <h3 className="font-bold text-xl mt-5">
                No Sales Found
              </h3>

              <p className="text-gray-500 mt-2">
                There are no
                transactions for this
                filter
              </p>
            </div>
          )}
        </div>
      </div>

     {/* MODAL */}
{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* BACKDROP */}
    <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />

    {/* GLOW */}
    <div className="absolute w-[500px] h-[500px] bg-emerald-500/20 blur-3xl rounded-full" />

    {/* MODAL CARD */}
    <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] border border-white/10 bg-[#0f1117]/95 shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
      
      {/* TOP GRADIENT */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Sale Items
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Products included in this transaction
          </p>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setShowModal(false)}
          className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:scale-105 hover:border-emerald-400/40 hover:bg-emerald-500 hover:text-white"
        >
          <X
            size={20}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
        </button>
      </div>

      {/* CONTENT */}
      <div className="max-h-[550px] overflow-y-auto px-8 py-6 scrollbar-thin scrollbar-thumb-white/10">
        {saleLoading ? (
          <div className="space-y-5">
            <div className="h-28 animate-pulse rounded-3xl bg-white/5" />
            <div className="h-28 animate-pulse rounded-3xl bg-white/5" />
          </div>
        ) : (
          <div className="space-y-5">
            {selectedItems.map((item) => (
              <div
                key={item.sale_item_id}
                className="group relative overflow-hidden rounded-[30px] border border-white/5 bg-white/[0.03] p-6 transition-all duration-300 hover:border-emerald-400/20 hover:bg-white/[0.05] hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)]"
              >
                {/* HOVER LIGHT */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -top-20 right-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
                </div>

                <div className="relative flex items-start justify-between gap-6">
                  
                  {/* LEFT */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold tracking-tight text-white">
                      {item.product?.name}
                    </h3>

                    <div className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-300">
                      Qty: {item.quantity}
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Total
                    </p>

                    <p className="mt-2 text-3xl font-black tracking-tight text-white">
                      ETB{" "}
                      {Number(item.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </>
  );
}

export default Recent;