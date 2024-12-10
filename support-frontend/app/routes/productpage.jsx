// app/routes/productpage.jsx
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { fetchProducts } from "../utils/product";
import Products from "../components/product";

export const loader = async ({ request }) => {
  const products = await fetchProducts(request);
  return json({ products });
};

export default function ProductsPage() {
  const { products } = useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <Products products={filteredProducts} layout="grid" />
    </div>
  );
}
