// top-section.jsx
"use client";
import React from "react";
import Image from "next/image";
import PostFilter from "./post-filter";

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
      <div className="flex items-center">
        <h3 className="text-[#0e0c11] w-[240px] text-[30px] font-bold">
          {title}
        </h3>
        <Image
          className="rounded-full bg-white object-cover h-[100px] w-25"
          src="/images/noavatar.png"
          alt="User Avatar"
          width={100}
          height={100}
        />
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
