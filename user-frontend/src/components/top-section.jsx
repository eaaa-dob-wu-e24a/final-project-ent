// top-section.jsx
"use client";
import React from "react";
import Image from "next/image";
import ProductFilter from "./product-filter";

export default function TopUI({
  title,
  marginBottom = "unset",
  products,
  onFilter,
  selectedProductType, // Receive the prop
}) {
  return (
    <section
      className={`bg-[#e2f0e9] flex flex-col pt-10 items-center gap-6 px-5`}
      style={{ marginBottom }}
    >
      <div className="flex items-center">
        <h3 className="text-[#0e0c11] w-[240px] text-[30px] font-bold font-['Amulya']">
          {title}
        </h3>
        <Image
          className="rounded-full object-cover h-[100px] w-25"
          src="/images/6740a5b045275.jpg"
          alt="Product Image"
          width={100}
          height={100}
        />
      </div>
      <ProductFilter
        products={products}
        onFilter={onFilter}
        selectedProductType={selectedProductType} // Pass it down to ProductFilter
      />
    </section>
  );
}
