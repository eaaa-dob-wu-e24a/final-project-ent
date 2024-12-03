// src/components/top-section.jsx
"use client";
import React from "react";
import PostFilter from "./post-filter";
import ProfilePicture from "./profile-picture"; // Import the ProfilePicture component

export default function TopUI({
  title,
  marginBottom = "unset",
  posts,
  onFilter,
  selectedProductType,
  searchQuery,
  onSearch,
}) {
  return (
    <section
      className="bg-[#e2f0e9] flex flex-col pt-10 items-center gap-6 px-5"
      style={{ marginBottom }}
    >
      <div className="flex items-center justify-between w-10/12">
        <h3 className="text-[#0e0c11] w-2/3 text-[30px] font-bold">{title}</h3>
        <ProfilePicture /> {/* Use the ProfilePicture component */}
      </div>
      <PostFilter
        posts={posts}
        onFilter={onFilter}
        selectedProductType={selectedProductType}
        searchQuery={searchQuery}
        onSearch={onSearch}
      />
    </section>
  );
}
