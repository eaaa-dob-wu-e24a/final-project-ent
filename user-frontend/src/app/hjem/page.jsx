import React from "react";
import ProductList from "../../components/card";
import TopUI from "@/components/top-section";

export default function Page() {
  return (
    <>
      <TopUI
        title="Udforsk alle former for rejseartikler"
        marginBottom="-50px"
      />
      <ProductList />
    </>
  );
}
