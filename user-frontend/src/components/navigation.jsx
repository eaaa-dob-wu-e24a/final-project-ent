"use client";

/*===============================================
=          This component is the global navigation / footer            =
===============================================*/

import React, { useState } from "react";
import { FaHouse, FaBookmark, FaUserLarge, FaPlus } from "react-icons/fa6";
import { PiHandbagSimpleFill } from "react-icons/pi";
import { FaTimes } from "react-icons/fa";
import ProductForm from "./product-form"; // Ensure the path and casing are correct
import Link from "next/link";
import LendrLogo from "./lendr-logo";

export default function Navigation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("default"); // State to track modal content

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) setModalContent("default"); // Reset modal content when reopening
  };

  const showProductForm = () => {
    setModalContent("productForm"); // Set content to ProductForm
  };

  return (
    <>
      {/* Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end transition-opacity duration-300 ${
          isModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsModalOpen(false)} // Close modal when clicking outside
      >
        {/* Modal Content */}
        <div
          className={`bg-white w-full z-20 max-w-md rounded-t-2xl shadow-lg transform transition-transform duration-300 overflow-y-auto ${
            isModalOpen ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent closing modal on inner click
          style={{ height: "700px" }} // Custom height
        >
          {modalContent === "default" ? (
            // Default modal content
            <div className="flex items-center mt-5 flex-col h-full">
              <LendrLogo />
              <p className="text-xl font-semibold text-center text-[#060606] mb-6">
                Opret opslag eller produkt
              </p>
              <div className="flex space-x-4 font-bold">
                <button
                  className="px-4 py-2 bg-[#2B8F60] text-white rounded-lg shadow-md"
                  onClick={showProductForm} // Show ProductForm on click
                >
                  Opret produkt
                </button>
                <button className="px-4 py-2 bg-[#5BAD86] text-white rounded-lg shadow-md">
                  Opret ordre
                </button>
              </div>
            </div>
          ) : (
            // Render ProductForm
            <ProductForm />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-4 py-2">
        <Link className="flex flex-col items-center text-gray-400" href="/hjem">
          <FaHouse size={30} />
        </Link>

        <Link
          className="flex flex-col items-center text-gray-400"
          href="/favoritter"
        >
          <FaBookmark size={25} />
        </Link>

        <button
          onClick={toggleModal}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg -translate-y-9 transition-all duration-300 ${
            isModalOpen ? "bg-[#FF7127]" : "bg-[#53BF6D]"
          }`}
        >
          <span
            className={`text-2xl text-white transform transition-transform duration-300 ${
              isModalOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            {isModalOpen ? <FaTimes size={24} /> : <FaPlus size={24} />}
          </span>
        </button>

        <Link
          className="flex flex-col items-center text-gray-400"
          href="/ordre-og-opslag"
        >
          <PiHandbagSimpleFill size={30} />
        </Link>

        <Link
          className="flex flex-col items-center text-gray-400"
          href="/profil"
        >
          <FaUserLarge size={24} />
        </Link>
      </footer>
    </>
  );
}
