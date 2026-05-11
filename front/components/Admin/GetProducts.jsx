"use client";

import React, { useEffect, useState } from "react";
import { axiosbaseurl } from "@/axios/axios";
import EditProductModal from "./EditProductModal";

function GetProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [status, setStatus] = useState({
    type: "",
    text: "",
  });

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await axiosbaseurl.get(
        "/admin/getProducts",
        {
          withCredentials: true,
        }
      );

      setProducts(res.data.product);

      setStatus({
        type: "success",
        text: "Products loaded successfully",
      });
    } catch (err) {
      console.log(err);

      setStatus({
        type: "error",
        text:
          err.response?.data?.error ||
          "Failed to load products",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await axiosbaseurl.delete(
        `/admin/deleteProduct/${id}`,
        {
          withCredentials: true,
        }
      );

      setProducts((prev) =>
        prev.filter(
          (product) => product.product_id !== id
        )
      );

      setStatus({
        type: "success",
        text: "Product deleted successfully",
      });
    } catch (err) {
      console.log(err);

      setStatus({
        type: "error",
        text:
          err.response?.data?.error ||
          "Failed to delete product",
      });
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================
 const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEdit(true);
  };

  const handleUpdate = (updatedProduct) => {
    console.log("Updated:", updatedProduct);

    // call your API here

    setShowEdit(false);
    setSelectedProduct(null);
  };
  return (
    <div className="min-h-screen  p-4 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Products
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your products
            </p>
          </div>

          <button
            onClick={() =>
              (window.location.href =
                "/dashboard/add-product")
            }
            className="bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-xl transition"
          >
            + Add Product
          </button>
        </div>

        {/* STATUS */}
        {status.text && (
          <div
            className={`mb-6 p-4 rounded-xl border text-sm font-medium
              
              ${
                status.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }
            `}
          >
            <div className="flex items-center gap-2">

              {status.type === "success" && (
                <span>✅</span>
              )}

              {status.type === "error" && (
                <span>❌</span>
              )}

              <span>{status.text}</span>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className=" rounded-3xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-60 bg-gray-500"></div>

                <div className="p-5">
                  <div className="h-6 bg-gray-500 rounded mb-3"></div>

                  <div className="h-4 bg-gray-500 rounded w-1/2 mb-5"></div>

                  <div className="h-10 bg-gray-500 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCTS GRID */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">

            {products.map((product) => (
              <div
                key={product.product_id}
                className="bg-gray-800 border-amber-900 border-2  rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
              >

                {/* IMAGE */}
                <div className="h-60 bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5">

                  {/* NAME */}
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold">
                      {product.name}
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      {product.brand || "No Brand"}
                    </p>
                  </div>

                  {/* PRICE + STOCK */}
                  <div className="flex items-center justify-between mb-5">

                    <div>
                      <p className="text-gray-500 text-sm">
                        Price
                      </p>

                      <h3 className="text-2xl font-bold">
                        ${product.price}
                      </h3>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-500 text-sm">
                        Stock
                      </p>

                      <h3
                        className={`text-xl font-bold
                          
                          ${
                            product.quantity <=
                            product.minStock
                              ? "text-red-500"
                              : "text-green-600"
                          }
                        `}
                      >
                        {product.quantity}
                      </h3>
                    </div>
                  </div>

                  {/* TYPE */}
                  <div className="mb-5">
                    <span className="bg-gray-600 px-3 py-1 rounded-full text-sm">
                      {product.type || "General"}
                    </span>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-3">

                    {/* EDIT */}
                    <>
                        <button
                            onClick={() => handleEdit(product)}
                            className="flex-1 bg-yellow-400/80 hover:bg-gray-800 text-white py-3 rounded-xl transition"
                        >
                            Edit
                        </button>

                        {showEdit && (
                            <EditProductModal
                            product={selectedProduct}
                            onClose={() => setShowEdit(false)}
                            onUpdate={handleUpdate}
                            />
                        )}
                        </>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NO PRODUCTS */}
        {!loading && products.length === 0 && (
          <div className="rounded-3xl shadow-lg p-10 text-center">

            <div className="text-7xl mb-5">
              📦
            </div>

            <h2 className="text-3xl font-bold mb-3">
              No Products Found
            </h2>
            <p className="text-gray-500 mb-6">
              Start by adding your first product
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GetProducts;