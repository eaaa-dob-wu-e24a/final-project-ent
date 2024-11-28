// page.jsx
"use client";
import React, { useState, useEffect } from "react";
import TopUI from "@/components/top-section";
import ProductList from "../../components/card";
import useProducts from "../../hooks/useProducts";

export default function Page() {
  const { products, loading, error } = useProducts(); // Fetch products
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // New state variable

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleFilter = (productType) => {
    setSelectedProductType(productType);
    applyFilters(productType, searchQuery);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(selectedProductType, query);
  };

  const applyFilters = (productType, query) => {
    let updatedProducts = products;

    // Apply category filter if selected
    if (productType) {
      updatedProducts = updatedProducts.filter(
        (product) => product.product_type === productType
      );
    }

    // Apply search filter if query is provided
    if (query) {
      updatedProducts = updatedProducts.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredProducts(updatedProducts);
  };

  return (
    <>
      <TopUI
        title="Udforsk alle former for rejseartikler"
        marginBottom="-50px"
        products={products}
        onFilter={handleFilter}
        selectedProductType={selectedProductType}
        searchQuery={searchQuery} // Pass down the search query
        onSearch={handleSearch} // Pass down the search handler
      />
      <ProductList
        products={filteredProducts}
        loading={loading}
        error={error}
      />
    </>
  );
}
