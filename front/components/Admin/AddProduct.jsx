"use client";

import { axiosbaseurl } from "@/axios/axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";

function AddProduct() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ status message
  const [status, setStatus] = useState({
    type: "", // success | error | loading
    text: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    barcode: "",
    qrcode: "",
    type: "",
    minStock: "",
    brand: "",
    description: "",
    branch_id: "",
  });
  console.log("Form Data:", formData.branch_id);

  const [image, setImage] = useState(null);

  // 📷 scanner state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanTarget, setScanTarget] = useState("barcode");

  const html5QrCodeRef = useRef(null);

  // =========================
  // FETCH BRANCHES
  // =========================
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await axiosbaseurl.get(
        "/admin/getEmployeeBranches",
        {
          withCredentials: true,
        }
      );

      setBranches(res.data.branches || []);
    } catch (err) {
      console.log(err);

      setStatus({
        type: "error",
        text: "Failed to load branches",
      });
    }
  };

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // BEEP SOUND
  // =========================
  const playBeep = () => {
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    );

    audio.play();
  };

  // =========================
  // START SCANNER
  // =========================
  const startScanner = (type) => {
    setScanTarget(type);
    setScannerOpen(true);

    setTimeout(async () => {
      const qr = new Html5Qrcode("reader");

      html5QrCodeRef.current = qr;

      try {
        await qr.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },

            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.UPC_A,
            ],
          },

          (decodedText) => {
            playBeep();

            setFormData((prev) => ({
              ...prev,
              [type]: decodedText,
            }));

            setStatus({
              type: "success",
              text: `${type} scanned successfully`,
            });

            stopScanner();
          }
        );
      } catch (err) {
        console.log(err);

        setStatus({
          type: "error",
          text: "Failed to access camera",
        });

        stopScanner();
      }
    }, 300);
  };

  // =========================
  // STOP SCANNER
  // =========================
  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.log(err);
      }
    }

    setScannerOpen(false);
  };

  // =========================
  // SUBMIT FORM
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setStatus({
        type: "loading",
        text: "Creating product...",
      });

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (image) {
        data.append("image", image);
      }

      const res = await axiosbaseurl.post(
        "/admin/addNewProduct",
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStatus({
        type: "success",
        text:
          res.data.message || "Product created successfully",
      });

      // ✅ reset form
      setFormData({
        name: "",
        price: "",
        quantity: "",
        barcode: "",
        qrcode: "",
        type: "",
        minStock: "",
        brand: "",
        description: "",
        branch_id: "",
      });

      setImage(null);
    } catch (err) {
      console.log(err);

      setStatus({
        type: "error",
        text:
          err.response?.data?.error ||
          "Failed to create product",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-fullp-4 md:p-10 flex justify-center">
      <div className="w-full max-w-5xl rounded-3xl shadow-xl p-6 md:p-10">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Add New Product
          </h1>

          <p className="text-gray-500 mt-2">
            Create product with barcode and QR scanner
          </p>
        </div>

        {/* STATUS MESSAGE */}
        {status.text && (
          <div
            className={`mb-6 p-4 rounded-xl border text-sm font-medium
              
              ${
                status.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : status.type === "error"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }
            `}
          >
            <div className="flex items-center gap-2">

              {/* LOADING */}
              {status.type === "loading" && (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}

              {/* SUCCESS */}
              {status.type === "success" && <span>✅</span>}

              {/* ERROR */}
              {status.type === "error" && <span>❌</span>}

              <span>{status.text}</span>
            </div>
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* PRODUCT NAME */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 focus:border-black outline-none p-3 rounded-xl"
            required
          />

          {/* PRICE */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border border-gray-300 focus:border-black outline-none p-3 rounded-xl"
            required
          />

          {/* QUANTITY */}
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="border border-gray-300 focus:border-black outline-none p-3 rounded-xl"
            required
          />

          {/* BRAND */}
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            className="border border-gray-300 focus:border-black outline-none p-3 rounded-xl"
          />

          {/* BRANCH SELECT */}
          <select
            name="branch_id"
            value={formData.branch_id}
            onChange={handleChange}
            disabled={branches.length === 0}
            className="border border-gray-300 focus:border-black outline-none p-3 rounded-xl disabled:bg-gray-100"
            required
          >
            <option value="">
              {branches.length === 0
                ? "Loading branches..."
                : "Select Branch"}
            </option>

            {branches.map((branch) => (
              <option
                key={branch.branch_id}
                value={branch.branch_id }
              >
                {branch.name}
              </option>
            ))}
          </select>

          {/* PRODUCT TYPE */}
          <input
            type="text"
            name="type"
            placeholder="Product Type"
            value={formData.type}
            onChange={handleChange}
            className="border border-gray-300 focus:border-black outline-none p-3 rounded-xl"
          />

          {/* MIN STOCK */}
          <input
            type="number"
            name="minStock"
            placeholder="Minimum Stock"
            value={formData.minStock}
            onChange={handleChange}
            className="border border-gray-300 focus:border-black outline-none p-3 rounded-xl"
          />

          {/* BARCODE */}
          <div className="flex gap-2">
            <input
              type="text"
              name="barcode"
              placeholder="Barcode"
              value={formData.barcode}
              onChange={handleChange}
              className="border border-gray-300 focus:border-black outline-none p-3 rounded-xl w-full"
            />

            <button
              type="button"
              onClick={() => startScanner("barcode")}
              className="px-5 bg-black hover:bg-gray-800 text-white rounded-xl transition"
            >
              Scan
            </button>
          </div>

          {/* QR CODE */}
          <div className="flex gap-2">
            <input
              type="text"
              name="qrcode"
              placeholder="QR Code"
              value={formData.qrcode}
              onChange={handleChange}
              className="border border-gray-300 focus:border-black outline-none p-3 rounded-xl w-full"
            />

            <button
              type="button"
              onClick={() => startScanner("qrcode")}
              className="px-5 bg-black hover:bg-gray-800 text-white rounded-xl transition"
            >
              Scan
            </button>
          </div>

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="md:col-span-2 border border-gray-300 focus:border-black outline-none p-3 rounded-xl min-h-[120px]"
          />

          {/* IMAGE */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">
              Product Image
            </label>

            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border border-gray-300 p-3 rounded-xl"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`md:col-span-2 p-4 rounded-xl text-white font-semibold transition-all duration-300
              
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }
            `}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                Creating Product...
              </div>
            ) : (
              "Create Product"
            )}
          </button>
        </form>
      </div>

      {/* SCANNER MODAL */}
      {scannerOpen && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">

          <div className="bg-white p-5 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center">
              Scan {scanTarget}
            </h2>

            <div
              id="reader"
              className="w-[300px] overflow-hidden rounded-xl"
            />

            <button
              onClick={stopScanner}
              className="mt-5 w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
            >
              Close Scanner
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProduct;