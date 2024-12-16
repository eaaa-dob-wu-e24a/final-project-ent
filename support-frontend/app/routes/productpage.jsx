// app/routes/productpage.jsx
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { fetchProducts } from "../utils/product_util";
import Products from "../components/product"; // Ensure the import path is correct

export const loader = async ({ request }) => {
  const products = await fetchProducts(request);
  const backendUrl = process.env.BACKEND_URL;

  return json({ products, backendUrl }); // Include backendUrl here
};

export default function ProductsPage() {
  const { products, backendUrl } = useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Filtere i produkter</h1>
      <input
        type="text"
        placeholder="Søg i produkter..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <Products
        products={filteredProducts}
        backendUrl={backendUrl}
        layout="grid"
      />
    </div>
  );
}
