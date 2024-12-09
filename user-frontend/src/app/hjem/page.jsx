// page.jsx
"use client";
import React, { useState, useEffect } from "react";
import TopUI from "@/components/top-section";
import ProductList from "../../components/card";
import usePosts from "../../hooks/usePosts";

export default function Page() {
  const { posts, loading, error } = usePosts(); // Fetch posts
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  const handleFilter = (productType) => {
    setSelectedProductType(productType);
    applyFilters(productType, searchQuery);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(selectedProductType, query);
  };

  const applyFilters = (productType, query) => {
    let updatedPosts = posts;

    // Apply category filter if selected
    if (productType) {
      updatedPosts = updatedPosts.filter((post) => {
        const postType = post.product_type
          ? post.product_type.trim().toLowerCase()
          : "";
        const filterType = productType.trim().toLowerCase();
        return postType === filterType;
      });
    }

    // Apply search filter if query is provided
    if (query) {
      updatedPosts = updatedPosts.filter((post) => {
        const title = post.title ? post.title.toLowerCase() : "";
        return title.includes(query.toLowerCase());
      });
    }

    setFilteredPosts(updatedPosts);
  };

  return (
    <>
      <TopUI
        title="Udforsk alle former for rejseartikler"
        marginBottom="-50px"
        posts={posts}
        onFilter={handleFilter}
        selectedProductType={selectedProductType}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />
      <ProductList posts={filteredPosts} loading={loading} error={error} />
    </>
  );
}
