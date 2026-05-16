"use client";

import React, {
  useRef,
  useState,
} from "react";

import { axiosbaseurl } from "@/axios/axios";

import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";

function AddExisting() {
  const [loading, setLoading] =
    useState(false);

  const [status, setStatus] =
    useState({
      type: "",
      text: "",
    });

  const [formData, setFormData] =
    useState({
      quantity: "",
      barcode: "",
      qrcode: "",
    });

  // =========================
  // SCANNER STATE
  // =========================
  const [scannerOpen, setScannerOpen] =
    useState(false);

  const [scanTarget, setScanTarget] =
    useState("barcode");

  const html5QrCodeRef = useRef(null);

  // =========================
  // HANDLE INPUT CHANGE
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
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setStatus({
        type: "loading",
        text: "Updating product...",
      });

      const res =
        await axiosbaseurl.post(
          "/admin/addExistingProduct",
          formData,
          {
            withCredentials: true,
          }
        );
        

      setStatus({
        type: "success",
        text:
          res.data.message ||
          "Product updated successfully",
      });

      // RESET
      setFormData({
        quantity: "",
        barcode: "",
        qrcode: "",
      });
    } catch (err) {
      console.log(err);

      setStatus({
        type: "error",
        text:
          err.response?.data?.error ||
          "Failed to update product",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center p-4 md:p-10">

      <div className="w-full max-w-3xl rounded-3xl shadow-2xl p-6 md:p-10">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl md:text-4xl font-bold">
            Add Existing Product
          </h1>

          <p className="text-gray-500 mt-2">
            Scan barcode or QR code to
            add stock
          </p>
        </div>

        {/* STATUS */}
        {status.text && (
          <div
            className={`mb-6 p-4 rounded-xl border text-sm font-medium
              
              ${
                status.type ===
                "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : status.type ===
                    "error"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }
            `}
          >
            <div className="flex items-center gap-2">

              {status.type ===
                "loading" && (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}

              {status.type ===
                "success" && <span>✅</span>}

              {status.type ===
                "error" && <span>❌</span>}

              <span>{status.text}</span>
            </div>
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* QUANTITY */}
          <input
            type="number"
            name="quantity"
            placeholder="Quantity to Add"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-black outline-none p-4 rounded-xl"
            required
          />

          {/* BARCODE */}
          <div className="flex gap-2">

            <input
              type="text"
              name="barcode"
              placeholder="Barcode"
              value={formData.barcode}
              onChange={handleChange}
              className="border border-gray-300 focus:border-black outline-none p-4 rounded-xl w-full"
            />

            <button
              type="button"
              onClick={() =>
                startScanner(
                  "barcode"
                )
              }
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
              className="border border-gray-300 focus:border-black outline-none p-4 rounded-xl w-full"
            />

            <button
              type="button"
              onClick={() =>
                startScanner(
                  "qrcode"
                )
              }
              className="px-5 bg-black hover:bg-gray-800 text-white rounded-xl transition"
            >
              Scan
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-4 rounded-xl text-white font-semibold transition-all duration-300
              
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

                Updating Product...
              </div>
            ) : (
              "Add Stock"
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

export default AddExisting;