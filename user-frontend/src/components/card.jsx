// product-list.jsx or card.jsx
"use client";
import React from "react";

export default function ProductList({ products, loading, error }) {
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
    <div className="w-full z-0 flex px-5 flex-col space-y-4 mx-auto">
      {products.map((product) => (
        <div
          key={product.id}
          className="relative py-3 bg-white rounded-lg shadow-lg flex flex-col items-start overflow-hidden"
        >
          {/* Decorative SVG */}
          {/* ... (Your existing SVG code) ... */}

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
                  className="w-3 h-3 rounded-full inline-block mr-2"
                  style={{ backgroundColor: product.colorCode }}
                ></span>
                {product.colorLabel}
              </p>
            </div>
          </div>

          {/* Product Image */}
          <div className="absolute right-[10px] h-[100px] top-4 z-10 w-[100px] flex-shrink-0">
            <img
              src={product.image}
              alt={product.title}
              className="object-cover h-full w-full rounded-[30px]"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
