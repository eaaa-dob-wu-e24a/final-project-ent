// File: /hooks/useMyProducts.jsx

import { useState, useEffect } from "react";

export default function useMyProducts() {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Optional: Mapping color codes to labels
  const colorLabels = {
    "#000000": "Sort",
    "#5337FF": "Blå",
    "#72CA81": "Grøn",
    "#7F8992": "Grå",
    "#9E29BB": "Lilla",
    "#C1C1C1": "Sølv",
    "#FF3DD4": "Pink",
    "#FF5757": "Rød",
    "#FFB23F": "Orange",
    "#FFE34E": "Gul",
    "#FFFFFF": "Hvid",
  };

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/my-products/read/`,
          {
            method: "GET",
            credentials: "include", // Include cookies for authentication if using sessions
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch your products.");
        }

        const data = await response.json();

        // Transform data if necessary
        const transformedProducts = data.map((product) => ({
          id: product.product_id,
          name: product.name,
          product_type: product.product_type,
          condition: product.product_condition,
          size: product.size,
          colorLabel: colorLabels[product.color] || product.color,
          colorCode: product.color,
          brand: product.brand,
          image:
            product.pictures.length > 0
              ? `http://localhost:4000/api/product/create/${product.pictures[0]}`
              : "../dummypicture.webp",
        }));

        setMyProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          err.message || "An error occurred while fetching your products."
        );
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, []);

  return { myProducts, loading, error };
}
