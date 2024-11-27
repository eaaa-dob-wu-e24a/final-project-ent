import { useState, useEffect } from "react";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/product/read/",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const data = await response.json();

        const transformedProducts = data.map((product) => ({
          id: product.PK_ID,
          title: product.name,
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

        setProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Der skete en fejl under hentning af produkter.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}
