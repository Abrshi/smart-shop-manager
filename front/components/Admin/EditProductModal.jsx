"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { axiosbaseurl } from "@/axios/axios";

import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";

function  EditProductModal({
  product,
  onClose,
  onUpdate,
}) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const [image, setImage] = useState(null);

  // =========================
  // SCANNER STATE
  // =========================
  const [scannerOpen, setScannerOpen] =
    useState(false);

  const [scanTarget, setScanTarget] =
    useState("barcode");

  const html5QrCodeRef = useRef(null);

  // =========================
  // LOAD PRODUCT DATA
  // =========================
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        quantity: product.quantity || "",
        barcode: product.barcode || "",
        qrcode: product.qrcode || "",
        type: product.type || "",
        minStock: product.minStock || "",
        brand: product.brand || "",
        description:
          product.description || "",
        branch_id:
          product.branch_id || "",
      });
    }
  }, [product]);

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

      setBranches(
        res.data.branches || []
      );
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
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
      const qr = new Html5Qrcode(
        "reader"
      );

      html5QrCodeRef.current = qr;

      try {
        await qr.start(
          { facingMode: "environment" },

          {
            fps: 10,

            qrbox: {
              width: 250,
              height: 250,
            },

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

            stopScanner();
          }
        );
      } catch (err) {
        console.log(err);

        alert(
          "Failed to access camera"
        );

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
  // UPDATE PRODUCT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach(
        (key) => {
          data.append(
            key,
            formData[key]
          );
        }
      );

      if (image) {
        data.append("image", image);
      }

      const res =
            await axiosbaseurl.post(
                `/admin/editProduct/${product.product_id}`,
                data,
                {
                withCredentials: true,

                headers: {
                    "Content-Type":
                    "multipart/form-data",
                },
                }
            );

      onUpdate(res.data.product);

      onClose();
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.error ||
          "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4">

      <div className="bg-gray-500 w-full max-w-4xl rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-3xl font-bold">
              Edit Product
            </h2>

            <p className="text-gray-500 mt-1">
              Update product information
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl outline-none focus:border-black"
            required
          />

          {/* PRICE */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl outline-none focus:border-black"
            required
          />

          {/* QUANTITY */}
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl outline-none focus:border-black"
            required
          />

          {/* BRAND */}
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl outline-none focus:border-black"
          />

          {/* BRANCH */}
          <select
            name="branch_id"
            value={formData.branch_id}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl outline-none focus:border-black"
          >
            <option value="">
              Select Branch
            </option>

            {branches.map((branch) => (
              <option
                key={
                  branch.branch_id
                }
                value={
                  branch.branch_id
                }
              >
                {branch.name}
              </option>
            ))}
          </select>

          {/* TYPE */}
          <input
            type="text"
            name="type"
            placeholder="Product Type"
            value={formData.type}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl outline-none focus:border-black"
          />

          {/* MIN STOCK */}
          <input
            type="number"
            name="minStock"
            placeholder="Minimum Stock"
            value={formData.minStock}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl outline-none focus:border-black"
          />

          {/* BARCODE */}
          <div className="flex gap-2">

            <input
              type="text"
              name="barcode"
              placeholder="Barcode"
              value={formData.barcode}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-xl outline-none focus:border-black w-full"
            />

            <button
              type="button"
              onClick={() =>
                startScanner(
                  "barcode"
                )
              }
              className="px-5 bg-black hover:bg-gray-800 text-white rounded-xl"
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
              className="border border-gray-300 p-3 rounded-xl outline-none focus:border-black w-full"
            />

            <button
              type="button"
              onClick={() =>
                startScanner(
                  "qrcode"
                )
              }
              className="px-5 bg-black hover:bg-gray-800 text-white rounded-xl"
            >
              Scan
            </button>
          </div>

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Description"
            value={
              formData.description
            }
            onChange={handleChange}
            className="md:col-span-2 border border-gray-300 p-3 rounded-xl min-h-[120px] outline-none focus:border-black"
          />

          {/* IMAGE */}
          <div className="md:col-span-2">

            <label className="block mb-2 font-medium">
              Product Image
            </label>

            <input
              type="file"
              onChange={(e) =>
                setImage(
                  e.target.files[0]
                )
              }
              className="w-full border border-gray-300 p-3 rounded-xl"
            />
          </div>

          {/* BUTTONS */}
          <div className="md:col-span-2 flex gap-4">

            {/* UPDATE */}
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 p-4 rounded-xl text-white font-semibold transition
              
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }
              `}
            >
              {loading
                ? "Updating..."
                : "Update Product"}
            </button>

            {/* CANCEL */}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* SCANNER MODAL */}
      {scannerOpen && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[100]">

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
              className="mt-5 w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              Close Scanner
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProductModal;