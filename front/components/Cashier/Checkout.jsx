"use client";

import React, {
  useEffect,
  useState,
} from "react";

import { axiosbaseurl } from "@/axios/axios";

function Checkout({
  products,
  setShowCheckout,
}) {
  const [loading, setLoading] =
    useState(false);

  const [backendTotal, setBackendTotal] =
    useState(0);

  const [error, setError] =
    useState("");

  // SEND PRODUCTS TO BACKEND
  // BACKEND WILL:
  // 1. FIND PRODUCT BY QR OR BARCODE
  // 2. CALCULATE REAL PRICE
  // 3. RETURN VERIFIED TOTAL

  const checkoutItems =
    products.map((item) => ({
      quantity: item.quantity,

      // SEND AVAILABLE ONE
      code:
        item.qr_code ||
        item.barcode,
    }));

  // GET VERIFIED TOTAL FROM BACKEND
  const getVerifiedTotal =
    async () => {
      try {
        setLoading(true);

        const response =
          await axiosbaseurl.post(
            "/cashier/verify-total",
            {
              products:
                checkoutItems,
            }
          );

        setBackendTotal(
          response.data.total
        );
      } catch (err) {
        setError(
          err.response?.data
            ?.error ||
            "Failed to verify total"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    getVerifiedTotal();
  }, []);

  // CONFIRM PAYMENT
  const confirmPayment =
    async () => {
      try {
        setLoading(true);

        const response =
          await axiosbaseurl.post(
            "/cashier/confirm",
            {
              products:
                checkoutItems,
            }
          );

        alert(
          response.data.message ||
            "Payment Confirmed"
        );

        setShowCheckout(false);
      } catch (err) {
        setError(
          err.response?.data
            ?.error ||
            "Payment failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        padding: "15px",
        backdropFilter:
          "blur(4px)",
      }}
    >
      {/* RECEIPT */}
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "#fff",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.25)",
          animation:
            "pop 0.3s ease",
        }}
      >
        {/* TOP */}
        <div
          style={{
            padding: "25px 20px",
            borderBottom:
              "2px dashed #ddd",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#000",
              fontSize: "30px",
              fontWeight: "900",
              letterSpacing: "3px",
            }}
          >
            RECEIPT
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#555",
              fontSize: "13px",
            }}
          >
            {new Date().toLocaleString()}
          </p>
        </div>

        {/* PRODUCTS */}
        <div
          style={{
            padding: "20px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {products.map((item) => (
            <div
              key={item.product_id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "18px",
                paddingBottom: "18px",
                borderBottom:
                  "1px solid #eee",
                transition:
                  "0.2s ease",
              }}
            >
              {/* IMAGE */}
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "#f5f5f5",
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* INFO */}
              <div
                style={{
                  flex: 1,
                }}
              >
                <div
                  style={{
                    color: "#000",
                    fontWeight: "700",
                    fontSize: "15px",
                    marginBottom: "4px",
                  }}
                >
                  {item.name}
                </div>

                <div
                  style={{
                    color: "#666",
                    fontSize: "13px",
                  }}
                >
                  Qty:{" "}
                  {item.quantity}
                </div>

                <div
                  style={{
                    color: "#666",
                    fontSize: "13px",
                  }}
                >
                  {item.price} ETB
                </div>
              </div>

              {/* PRICE */}
              <div
                style={{
                  fontWeight: "800",
                  color: "#000",
                  fontSize: "15px",
                }}
              >
                {item.price *
                  item.quantity}{" "}
                ETB
              </div>
            </div>
          ))}

          {/* TOTAL */}
          <div
            style={{
              marginTop: "10px",
              paddingTop: "20px",
              borderTop:
                "2px dashed #ddd",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#000",
                }}
              >
                Verified Total
              </span>

              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "900",
                  color: "#000",
                }}
              >
                {loading
                  ? "..."
                  : backendTotal}{" "}
                ETB
              </span>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div
              style={{
                marginTop: "15px",
                background:
                  "#fff0f0",
                color: "red",
                padding: "12px",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            padding: "20px",
            borderTop:
              "1px solid #eee",
          }}
        >
          <button
            onClick={() =>
              setShowCheckout(false)
            }
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "14px",
              border:
                "2px solid #ddd",
              background: "#fff",
              color: "#000",
              fontWeight: "700",
              cursor: "pointer",
              transition:
                "0.2s ease",
            }}
          >
            Close
          </button>

          <button
            onClick={
              confirmPayment
            }
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              background: "#000",
              color: "#fff",
              fontWeight: "800",
              cursor: "pointer",
              transition:
                "0.2s ease",
              transform:
                loading
                  ? "scale(0.98)"
                  : "scale(1)",
            }}
          >
            {loading
              ? "Processing..."
              : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;