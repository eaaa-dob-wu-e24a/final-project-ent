"use client";
import React from "react";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";

export default function PostFilter({
  posts = [],
  onFilter,
  selectedProductType,
  searchQuery,
  onSearch,
}) {
  const predefinedProductTypes = ["kuffert", "vandrerygsaek", "rygsaek"];
  const productTypeLabels = {
    kuffert: "Kuffert",
    vandrerygsaek: "Vandrerygsæk",
    rygsaek: "Rygsæk",
  };

  return (
    <>
      <div className="flex gap-4 w-full justify-between">
        <div className="relative w-full">
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            placeholder="Søg efter produkter"
            className="w-full h-full pl-10 pr-4 py-2 rounded-[20px] focus:outline-none"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Image
          src="/images/filter-btn.svg"
          alt="Filter Button"
          width={62}
          height={58}
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <p className="text-sm italic text-text">scroll til siden</p>
        <div className="flex w-full mb-20 justify-between gap-2 text-sm overflow-x-auto no-scrollbar">
          <div
            onClick={() => onFilter(null)}
            className={`cursor-pointer w-auto px-4 h-11 flex items-center justify-center rounded-[10px] ${
              selectedProductType === null
                ? "bg-[#1BBB66] text-white"
                : "bg-white text-[#8c8c8c]"
            }`}
          >
            Alle
          </div>
          {predefinedProductTypes.map((productType, index) => (
            <div
              key={index}
              onClick={() => onFilter(productType)}
              className={`cursor-pointer w-auto px-4 h-11 flex items-center justify-center rounded-[10px] ${
                selectedProductType === productType
                  ? "bg-[#1BBB66] text-white"
                  : "bg-white text-[#8c8c8c]"
              }`}
            >
              {productTypeLabels[productType] || productType}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
