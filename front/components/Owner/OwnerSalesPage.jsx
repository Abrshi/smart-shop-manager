"use client";

import React, { useEffect, useMemo, useState } from "react";
import { axiosbaseurl } from "@/axios/axios";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Building2,
  User,
  Calendar,
} from "lucide-react";

export default function OwnerSalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //-----------------------------------
  // FETCH DATA
  //-----------------------------------
  const fetchSales = async () => {
    try {
      setLoading(true);

      const res = await axiosbaseurl.get(
        "/owner/getOwnerSalesData",
        {
          withCredentials: true,
        }
      );

      setSales(res.data);

    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.error ||
          "Failed to fetch sales data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  //-----------------------------------
  // ANALYTICS
  //-----------------------------------
  const analytics = useMemo(() => {
    let totalRevenue = 0;
    let totalItemsSold = 0;

    const branchMap = {};

    sales.forEach((sale) => {
      totalRevenue += Number(sale.total || 0);

      if (!branchMap[sale.branch.branch_id]) {
        branchMap[sale.branch.branch_id] = {
          name: sale.branch.name,
          salesCount: 0,
          revenue: 0,
        };
      }

      branchMap[sale.branch.branch_id].salesCount += 1;
      branchMap[sale.branch.branch_id].revenue += Number(
        sale.total || 0
      );

      sale.items.forEach((item) => {
        totalItemsSold += Number(item.quantity || 0);
      });
    });

    return {
      totalSales: sales.length,
      totalRevenue,
      totalItemsSold,
      branches: Object.values(branchMap),
    };
  }, [sales]);

  //-----------------------------------
  // LOADING
  //-----------------------------------
  if (loading) {
    return (
      <div className="p-6 text-lg font-semibold">
        Loading sales...
      </div>
    );
  }

  //-----------------------------------
  // ERROR
  //-----------------------------------
  if (error) {
    return (
      <div className="p-6 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold">
        Owner Sales Dashboard
      </h1>

      {/* ANALYTICS */}
      <div className="grid md:grid-cols-4 gap-4">

        {/* TOTAL SALES */}
        <div className="bg-gray-700 shadow rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag size={20} />
            <h2 className="font-semibold">
              Total Sales
            </h2>
          </div>

          <p className="text-2xl font-bold">
            {analytics.totalSales}
          </p>
        </div>

        {/* REVENUE */}
        <div className="bg-gray-700 shadow rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} />
            <h2 className="font-semibold">
              Revenue
            </h2>
          </div>

          <p className="text-2xl font-bold">
            ETB {analytics.totalRevenue}
          </p>
        </div>

        {/* ITEMS */}
        <div className="bg-gray-700 shadow rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package size={20} />
            <h2 className="font-semibold">
              Items Sold
            </h2>
          </div>

          <p className="text-2xl font-bold">
            {analytics.totalItemsSold}
          </p>
        </div>

        {/* BRANCHES */}
        <div className="bg-gray-700 shadow rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={20} />
            <h2 className="font-semibold">
              Active Branches
            </h2>
          </div>

          <p className="text-2xl font-bold">
            {analytics.branches.length}
          </p>
        </div>

      </div>

      {/* BRANCH PERFORMANCE */}
      <div className="bg-gray-700 shadow rounded-xl p-5">
        <h2 className="text-xl font-bold mb-4">
          Branch Performance
        </h2>

        <div className="space-y-3">
          {analytics.branches.map((branch, index) => (
            <div
              key={index}
              className="border p-3 rounded-lg"
            >
              <h3 className="font-semibold">
                {branch.name}
              </h3>

              <p>
                Sales: {branch.salesCount}
              </p>

              <p>
                Revenue: ETB {branch.revenue}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SALES LIST */}
      <div className="space-y-4">

        <h2 className="text-2xl font-bold">
          Recent Sales
        </h2>

        {sales.map((sale) => (
          <div
            key={sale.sale_id}
            className="bg-gray-700 shadow rounded-xl p-5"
          >

            {/* TOP */}
            <div className="flex flex-wrap gap-6 mb-4">

              <div className="flex items-center gap-2">
                <Building2 size={18} />
                <span>
                  {sale.branch.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <User size={18} />
                <span>
                  {sale.user.first_name}{" "}
                  {sale.user.father_name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>
                  {new Date(
                    sale.created_at
                  ).toLocaleDateString()}
                </span>
              </div>

            </div>

            {/* TOTAL */}
            <div className="mb-4">
              <p className="text-xl font-bold">
                ETB {sale.total}
              </p>
            </div>

            {/* ITEMS */}
            <div>
              <h3 className="font-semibold mb-2">
                Sold Products
              </h3>

              <div className="space-y-2">
                {sale.items.map((item) => (
                  <div
                    key={item.sale_item_id}
                    className="border rounded-lg p-3"
                  >
                    <p className="font-medium">
                      {item.product.name}
                    </p>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                    <p>
                      Price: ETB {item.price}
                    </p>

                    <p>
                      Total: ETB{" "}
                      {item.quantity * item.price}
                    </p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}