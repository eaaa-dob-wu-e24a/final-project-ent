// page.jsx
"use client";
import React, { useState, useEffect } from "react";
import TopUI from "@/components/top-section";
import ProductList from "../../components/card";
import useProducts from "../../hooks/useProducts";

export default function Page() {
  const { products, loading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState(null); // New state variable

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleFilter = (productType) => {
    setSelectedProductType(productType); // Update selected category
    if (!productType) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.product_type === productType)
      );
    }
  };

  return (
    <>
      <TopUI
        title="Udforsk alle former for rejseartikler"
        marginBottom="-50px"
        products={products}
        onFilter={handleFilter}
        selectedProductType={selectedProductType} // Pass down the selected category
      />
      <ProductList
        products={filteredProducts}
        loading={loading}
        error={error}
      />
    </>
  );
}
