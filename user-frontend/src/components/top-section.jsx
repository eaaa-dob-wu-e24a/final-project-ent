"use client";

/*===============================================
=          
Top-section - Which also works as the fetch call for product_type: fetch call might be moved into an product.actions 
functionality later on.           
=
===============================================*/

import React, { useEffect, useState } from "react";
import Image from "next/image";
export default function TopUi() {
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

        const productTypeLabels = {
          kuffert: "Kuffert",
          vandrerygsaek: "Vandrerygsæk",
          rygsaek: "Rygsæk",
          // Add other mappings as needed
        };

        const transformedProducts = data.map((product) => ({
          id: product.PK_ID,
          type: productTypeLabels[product.product_type] || product.product_type,
          // Include other fields as needed
        }));

        setProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          err.message || "Der skete en fejl under hentning af produkter."
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures this runs once on mount

  // Handle loading state
  if (loading) {
    return <p className="text-center">Indlæser produkter...</p>;
  }

  // Handle error state
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // Handle no products found
  if (products.length === 0) {
    return <p className="text-center">Ingen produkter fundet.</p>;
  }

  // Get unique product types
  const uniqueProductTypes = [
    ...new Set(products.map((product) => product.type)),
  ];

  return (
    <section className="bg-[#e2f0e9]">
      <div className="flex">
        <input className="w-[275px]" type="search" name="" id="" />

        <Image
          className=""
          src="/images/filter-btn.svg"
          alt="Product Image"
          width={62}
          height={58}
        />
      </div>

      <div className="flex gap-3 mb-20">
        {uniqueProductTypes.map((type, index) => (
          <div
            key={index}
            className="w-auto px-4 text-[#8c8c8c] h-11 flex items-center justify-center bg-white rounded-[10px]"
          >
            {type}
          </div>
        ))}
      </div>
    </section>
  );
}
