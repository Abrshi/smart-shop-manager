"use client"
import Checkout from '@/components/Cashier/Checkout';
import Scanner from '@/components/Cashier/Scanner'
import React, { useState } from "react";
function page() {
  const [products, setProducts] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  return (
     <div>
      <Scanner
        products={products}
        setProducts={setProducts}
      />

      {/* Checkout Button */}
      <button
        onClick={() =>
          setShowCheckout(true)
        }
        style={{
          marginTop: "20px",
          padding: "10px 20px",
        }}
      >
        Checkout
      </button>

      {/* Show Checkout ONLY when clicked */}
      {showCheckout && (
        <Checkout
          products={products}
          setShowCheckout={
            setShowCheckout
          }
        />
      )}
    </div>
  )
}

export default page