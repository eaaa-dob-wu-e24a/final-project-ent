"use client";

import { useState } from "react";
import UserProducts from "./user-products";
import UserPosts from "./user-posts";

export default function FilterSquare({ products, posts }) {
  const [activeFilter, setActiveFilter] = useState("Ordre");

  const filteredContent = () => {
    switch (activeFilter) {
      case "Ordre":
        return <div>Content for Ordre</div>;
      case "Produkter":
        return <UserProducts products={products} />;
      case "Opslag":
        return <UserPosts posts={posts}/>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex justify-between gap-4 text-center">
        <div
          className={`${
            activeFilter === "Ordre" ? "bg-activegreen text-white" : "bg-graybtn text-text"
          } py-2 px-4 rounded-lg w-1/3`}
          onClick={() => setActiveFilter("Ordre")}
        >
          <p>Ordre</p>
        </div>
        <div
          className={`${
            activeFilter === "Produkter" ? "bg-activegreen text-white" : "bg-graybtn text-text"
          } py-2 px-4 rounded-lg w-1/3`}
          onClick={() => setActiveFilter("Produkter")}
        >
          <p>Produkter</p>
        </div>
        <div
          className={`${
            activeFilter === "Opslag" ? "bg-activegreen text-white" : "bg-graybtn text-text"
          } py-2 px-4 rounded-lg w-1/3`}
          onClick={() => setActiveFilter("Opslag")}
        >
          <p>Opslag</p>
        </div>
      </div>
      <div className="mt-6">{filteredContent()}</div>
    </>
  );
}
