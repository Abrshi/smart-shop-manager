'use client';

import React, { useEffect, useRef, useState } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";

import {
  QrCode,
  Barcode,
  ScanLine,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Loader2,
  ShoppingCart,
} from "lucide-react";

import { axiosbaseurl } from "@/axios/axios";

function Scanner({
  products,
  setProducts
})  {
  const scannerRef = useRef(null);

  // PREVENT MULTI SCAN
  const lastScanRef = useRef("");
  const scanLockRef = useRef(false);

  const [scanMode, setScanMode] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const [scanStatus, setScanStatus] = useState({
    type: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // SHOW MESSAGE
  // =========================
  const showMessage = (type, message) => {
    setScanStatus({
      type,
      message,
    });

    setTimeout(() => {
      setScanStatus({
        type: "",
        message: "",
      });
    }, 2000);
  };

  // =========================
  // STOP SCANNER
  // =========================
  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();

        scannerRef.current = null;
      }
    } catch (err) {
      console.log(err);
    }

    setIsScanning(false);
  };

  // =========================
  // START SCANNER
  // =========================
  const startScanner = async (mode) => {
    try {
      // STOP OLD
      await stopScanner();

      setScanMode(mode);

      const scanner = new Html5Qrcode("reader");

      scannerRef.current = scanner;

      const formats =
        mode === "qr"
          ? [Html5QrcodeSupportedFormats.QR_CODE]
          : [
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.CODE_39,
            ];

      setIsScanning(true);

      showMessage(
        "info",
        `Scanning ${mode === "qr" ? "QR Code" : "Barcode"}`
      );

      await scanner.start(
  {
    facingMode: "environment",
 
        },
        {
          fps: 20,

          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(
              viewfinderWidth,
              viewfinderHeight
            );

            return {
              width: minEdge * 0.8,
              height:
                mode === "barcode"
                  ? minEdge * 0.35
                  : minEdge * 0.8,
            };
          },

          aspectRatio: 1.777778,

          disableFlip: false,

          formatsToSupport: formats,

          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
        },

        async (decodedText) => {
          // AVOID DUPLICATE RAPID SCANS
          if (scanLockRef.current) return;

          if (lastScanRef.current === decodedText)
            return;

          scanLockRef.current = true;

          lastScanRef.current = decodedText;

          await handleScan(decodedText);

          // UNLOCK AFTER SHORT DELAY
          setTimeout(() => {
            scanLockRef.current = false;

            lastScanRef.current = "";
          }, 1200);
        },

        () => {}
      );
    } catch (err) {
      console.log("Scanner error:", err);

      showMessage(
        "error",
        "Camera failed to start"
      );

      setIsScanning(false);
    }
  };

  // =========================
  // HANDLE SCAN
  // =========================
  const handleScan = async (code) => {
    try {
      setLoading(true);

      const res = await axiosbaseurl.post(
        "/cashier/scan",
        {
          code,
          type: scanMode,
        }
      );

      const data = res.data;

      if (!data.success) {
        showMessage(
          "error",
          data.message || "Product not found"
        );

        setLoading(false);

        return;
      }

      showMessage(
        "success",
        `${data.name} scanned`
      );

      const product = {
        product_id: data.product_id,
        name: data.name,
        price: data.price,
        image: data.image,
        barcode: data.barcode,
        qr_code: data.qr_code,
      };

      setProducts((prev) => {
        const exists = prev.find(
          (p) => p.product_id === product.product_id
        );

        if (exists) {
          return prev.map((p) =>
            p.product_id === product.product_id
              ? {
                  ...p,
                  quantity: p.quantity + 1,
                }
              : p
          );
        }

        return [
          ...prev,
          {
            ...product,
            quantity: 1,
          },
        ];
      });

      setLoading(false);
    } catch (err) {
      console.log(err);

      showMessage(
        "error",
        err.response?.data?.message ||
          "Scan failed"
      );

      setLoading(false);
    }
  };

  // =========================
  // QUANTITY
  // =========================
  const increaseQty = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === id
          ? {
              ...p,
              quantity: p.quantity + 1,
            }
          : p
      )
    );
  };

  const decreaseQty = (id) => {
    setProducts((prev) =>
      prev
        .map((p) =>
          p.product_id === id
            ? {
                ...p,
                quantity: p.quantity - 1,
              }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  // =========================
  // TOTAL
  // =========================
  const total = products.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  // =========================
  // CLEANUP
  // =========================
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 p-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-5xl font-black text-slate-800">
            Smart Cashier Scanner
          </h1>

          <p className="text-slate-500 mt-2">
            Lightning-fast product scanning 
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT SIDE */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5">
            {/* BUTTONS */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => startScanner("qr")}
                disabled={isScanning}
                className={`rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 transition-all
                ${
                  scanMode === "qr"
                    ? "bg-black text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <QrCode size={20} />
                Scan QR
              </button>

              <button
                onClick={() => startScanner("barcode")}
                disabled={isScanning}
                className={`rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 transition-all
                ${
                  scanMode === "barcode"
                    ? "bg-black text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <Barcode size={20} />
                Barcode
              </button>
            </div>

            {/* STATUS */}
            {scanStatus.message && (
              <div
                className={`mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 text-sm font-semibold
                ${
                  scanStatus.type === "success"
                    ? "bg-green-100 text-green-700"
                    : scanStatus.type === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {scanStatus.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : scanStatus.type === "error" ? (
                  <AlertCircle size={18} />
                ) : loading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <ScanLine size={18} />
                )}

                {scanStatus.message}
              </div>
            )}

            {/* CAMERA */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-black">
              <div
                id="reader"
                className="w-full min-h-[320px]"
              />
            </div>

            {/* SCAN STATE */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-slate-500">
                Current Mode:
                <span className="ml-1 font-bold text-slate-800">
                  {scanMode || "None"}
                </span>
              </div>

              <div
                className={`flex items-center gap-2 font-semibold text-sm
                ${
                  isScanning
                    ? "text-green-600"
                    : "text-slate-400"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full
                  ${
                    isScanning
                      ? "bg-green-500 animate-pulse"
                      : "bg-slate-300"
                  }`}
                />
                {isScanning ? "Scanning..." : "Idle"}
              </div>
            </div>
          </div>
          {/* RIGHT SIDE */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5">
            {/* TOP */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <ShoppingCart size={24} />
                  Cart
                </h2>

                <p className="text-sm text-slate-500">
                  {products.length} products
                </p>
              </div>

              <div className="bg-black text-white px-5 py-3 rounded-2xl">
                <div className="text-xs opacity-70">
                  TOTAL
                </div>

                <div className="text-xl font-bold">
                  {total.toFixed(2)} ETB
                </div>
              </div>
            </div>

            {/* PRODUCT LIST */}
            <div className="space-y-4 max-h-[650px] overflow-y-auto pr-1">
              {products.length === 0 && (
                <div className="py-20 text-center text-slate-400">
                  <ScanLine
                    size={60}
                    className="mx-auto mb-4 opacity-30"
                  />

                  <p>No products scanned yet</p>
                </div>
              )}

              {products.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-slate-50 border border-slate-200 rounded-3xl p-4 flex items-center gap-4"
                >
                  {/* IMAGE */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-2xl"
                  />

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">
                      {item.name}
                    </h3>

                    <p className="text-slate-500 text-sm mt-1">
                      {item.price} ETB
                    </p>

                    <div className="mt-2 text-xs bg-blue-300 border rounded-xl px-3 py-1 inline-flex">
                      Qty: {item.quantity}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-3 bg-white border border-slate-200 shadow-sm rounded-2xl px-2 py-2">
                    <button
                      onClick={() => decreaseQty(item.product_id)}
                      className="
                        w-11 h-11
                        flex items-center justify-center
                        rounded-xl
                        bg-slate-50
                        text-slate-700
                        hover:bg-slate-100
                        active:scale-95
                        transition-all duration-200
                      "
                    >
                      <Minus size={18} strokeWidth={2.5} />
                    </button>

                    <div className="min-w-[40px] text-center">
                      <span className="text-lg font-semibold text-slate-900">
                        {item.quantity}
                      </span>
                    </div>

                    <button
                      onClick={() => increaseQty(item.product_id)}
                      className="
                        w-11 h-11
                        flex items-center justify-center
                        rounded-xl
                        bg-gradient-to-br from-slate-900 to-slate-700
                        text-white
                        shadow-md
                        hover:shadow-lg
                        hover:scale-105
                        active:scale-95
                        transition-all duration-200
                      "
                    >
                      <Plus size={18} strokeWidth={2.5} />
                    </button>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scanner;