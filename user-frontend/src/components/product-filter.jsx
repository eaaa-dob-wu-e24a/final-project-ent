"use client";

/*===============================================
=          
Top-section - Which also works as the fetch call for product_type: fetch call might be moved into an product.actions 
functionality later on.           
=
===============================================*/

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";

export default function ProductFilter() {
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
    <>
      <div className="flex gap-4">
        <div className="relative w-[275px]">
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            placeholder="Søg efter produkter"
            className="w-full h-full pl-10 pr-4 py-2 rounded-[20px]  focus:outline-none"
            type="search"
            name=""
            id=""
          />
        </div>

        <Image
          className=""
          src="/images/filter-btn.svg"
          alt="Product Image"
          width={62}
          height={58}
        />
      </div>
      <div className="flex gap-3 mb-20 w-[350px]">
        {uniqueProductTypes.map((type, index) => (
          <div
            key={index}
            className="w-auto px-4 text-[#8c8c8c] h-11 flex items-center justify-center bg-white rounded-[10px]"
          >
            {type}
          </div>
        ))}
      </div>
    </>
  );
}
