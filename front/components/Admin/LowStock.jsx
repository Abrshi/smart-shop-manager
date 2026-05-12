import { useEffect, useState } from "react";
import { axiosbaseurl } from "@/axios/axios";

const LowStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);

      const response = await axiosbaseurl.get("/admin/LowStockProducts", {
       
      });

      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch low stock products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-4">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Low Stock Products</h1>

        <button
          onClick={fetchLowStockProducts}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Refresh
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-500">No low stock products found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product.product_id}
              className="bg-white shadow rounded-xl p-4 border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {product.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    SKU: {product.sku || "N/A"}
                  </p>

                  <p className="text-sm text-gray-500">
                    Brand: {product.brand || "N/A"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-red-500 font-bold text-lg">
                    Qty: {product.quantity}
                  </p>

                  <p className="text-sm text-gray-500">
                    Min: {product.minStock}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="font-semibold">
                  ${product.price}
                </p>

                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                  Low Stock
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStock;