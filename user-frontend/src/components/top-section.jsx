"use client";
import React, { useEffect, useState } from "react";

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

        // Transform the fetched data to match the frontend structure
        const transformedProducts = data.map((product) => ({
          id: product.PK_ID,
          type: product.product_type, // Corrected typo from 'tpye' to 'type'
          // Adjust based on your server setup
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
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      {uniqueProductTypes.map((type, index) => (
        <div
          key={index}
          className="product-item p-2 my-2 bg-white rounded-md shadow-sm hover:bg-gray-50 transition duration-200"
        >
          <span className="font-medium text-blue-600">Produkt type:</span>{" "}
          {type}
        </div>
      ))}
    </div>
  );
}
