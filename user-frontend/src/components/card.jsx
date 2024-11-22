"use client";
import React, { useEffect, useState } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([]); // State to hold fetched products
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(""); // State to handle errors

  useEffect(() => {
    // Function to fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/product/read/",
          {
            method: "GET",
            credentials: "include", // Include credentials if needed
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const data = await response.json();

        // Transform the fetched data to match the frontend structure
        const transformedProducts = data.map((product) => ({
          id: product.PK_ID,
          title: product.name,
          condition: product.product_condition,
          size: product.size,
          color: product.color,
          status: "Aktivt opslag", // Assuming all products are active; adjust as needed
          image:
            product.pictures.length > 0
              ? `http://localhost:4000/api/product/create/${product.pictures[0]}`
              : "../dummypicture.webp", // Use the first image or a placeholder
        }));

        setProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Der skete en fejl under hentning af produkter.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures this runs once on mount

  if (loading) {
    return <p className="text-center">Indlæser produkter...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="text-center">Ingen produkter fundet.</p>;
  }

  return (
    <div className="w-full z-0 p- flex px-5 flex-col space-y-4 mx-auto">
      {products.map((product) => (
        <div
          key={product.id}
          className="relative py-3 bg-white rounded-lg shadow-lg flex flex-col items-start overflow-hidden"
        >
          {/* Decorative SVG */}
          <svg
            className="absolute right-[-8px] top-0 h-48 w-[150px] object-cover pointer-events-none"
            width="103"
            height="144"
            viewBox="0 0 103 144"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M79.4404 105.271C79.4404 103.566 79.0981 102.458 78.4135 101.947C77.9001 101.265 77.3012 100.412 76.6165 99.3891C70.6267 102.97 62.3265 104.76 51.716 104.76C37.5116 104.76 25.7033 100.071 16.2907 90.6939C6.02242 80.9756 0.888306 68.5294 0.888306 53.3554C0.888306 34.4304 6.79255 19.6825 18.601 9.1118C30.5806 -1.62939 45.8974 -7 64.5514 -7C86.2858 -7 103.399 0.416556 115.893 15.2496C128.557 30.0827 134.888 48.8373 134.888 71.5132C134.888 99.6448 127.273 121.468 112.042 136.983C96.9819 152.328 78.9269 160 57.877 160C44.6995 160 34.089 157.102 26.0455 151.306C18.0021 145.337 13.9803 137.154 13.9803 126.754C13.9803 118.74 16.034 112.347 20.1413 107.573C29.5537 113.37 39.1375 116.268 48.8923 116.268C58.8183 116.268 66.3483 115.33 71.4825 113.455C76.7876 111.58 79.4404 108.852 79.4404 105.271Z"
              fill="#FF7127"
            />
          </svg>

          {/* Product Details */}
          <div className="pl-5 p-1 grid gap-4 relative z-10">
            <h3 className="text-xl pt-2 text-[#060606] font-bold">
              {product.title}
            </h3>
            <div className="grid gap-1">
              <p className="text-[#888D96] text-xs">
                <span className="font-medium">Tilstand:</span>{" "}
                {product.condition}
              </p>
              <p className="text-[#888D96] text-xs">
                <span className="font-medium">Størrelse:</span> {product.size}
              </p>
              <p className="flex items-center text-gray-600 text-xs">
                <span
                  className="w-3 h-3 bg-black rounded-full inline-block mr-2"
                  style={{ backgroundColor: product.color }}
                ></span>
                {product.color}
              </p>
            </div>
            <p className="text-[#5BAD86] font-semibold text-xs ">
              {product.status}
            </p>
          </div>

          {/* Product Image */}
          <div className="absolute right-[10px] h-[200px] top-4 z-10 w-[100px] flex-shrink-0">
            <img
              src={product.image}
              alt={product.title}
              className="object-contain rounded-[30px]"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
