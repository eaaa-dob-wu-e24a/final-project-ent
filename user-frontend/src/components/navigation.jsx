"use client";
import React, { useState } from "react";
import { FaHouse, FaBookmark, FaUserLarge, FaPlus } from "react-icons/fa6";
import { PiHandbagSimpleFill } from "react-icons/pi";
import { FaTimes } from "react-icons/fa";

export default function Navigation() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
          className={`bg-white w-full max-w-md rounded-t-2xl p-6 shadow-lg transform transition-transform duration-300 ${
            isModalOpen ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent closing modal on inner click
          style={{ height: "700px" }} // Add custom height here
        >
          <div className="flex items-center flex-col h-full">
            <h2
              className="text-5xl text-[#53BF6D] mb-4"
              style={{ fontFamily: "Modak" }}
            >
              LEND'<span className="text-[#FF7127]">r</span>
            </h2>
            <p className="text-xl font-semibold text-center text-[#060606] mb-6">
              Opret opslag eller produkt
            </p>
            <div className="flex space-x-4 font-bold">
              <button className="px-4 py-2 bg-[#2B8F60] text-white rounded-lg shadow-md">
                Opret produkt
              </button>
              <button className="px-4 py-2 bg-[#5BAD86] text-white rounded-lg shadow-md">
                Opret ordre
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-4 py-2">
        <button className="flex flex-col items-center text-gray-400">
          <FaHouse size={30} />
        </button>

        <button className="flex flex-col items-center text-gray-400">
          <FaBookmark size={25} />
        </button>

        <button
          onClick={toggleModal}
          className={`w-20 h-20 rounded-full  flex items-center justify-center shadow-lg -translate-y-9 transition-all duration-300 ${
            isModalOpen ? "bg-[#FF7127]" : "bg-[#53BF6D]"
          }`}
        >
          <span
            className={`text-2xl text-white  transform transition-transform duration-300 ${
              isModalOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            {isModalOpen ? <FaTimes size={24} /> : <FaPlus size={24} />}
          </span>
        </button>

        <button className="flex flex-col items-center text-gray-400">
          <PiHandbagSimpleFill size={30} />
        </button>

        <button className="flex flex-col items-center text-gray-400">
          <FaUserLarge size={24} />
        </button>
      </footer>
    </>
  );
}
