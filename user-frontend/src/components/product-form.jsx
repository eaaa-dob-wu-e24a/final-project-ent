"use client";

/*===============================================
=   This component creates product for user - Its imported in the navigation.jsx  =
===============================================*/

import { useState, useRef } from "react";
import Image from "next/image";
import { createProduct } from "../helpers/products"; // Corrected import statement
import { toast } from "react-hot-toast";

function ProductForm({ closeModal }) {
  // Form data state for managing product fields
  const [formData, setFormData] = useState({
    name: "",
    product_type: "",
    size: "",
    color: "",
    product_condition: "",
    brand: "",
  });

  // Image file state for handling the uploaded image
  const [imageFile, setImageFile] = useState(null);

  // Message state for displaying success or error messages
  const [message, setMessage] = useState({ text: "", type: "" });

  // Predefined options for product types
  const productTypes = [
    { value: "kuffert", label: "Kuffert" },
    { value: "vandrerygsaek", label: "Vandrerygsæk" },
    { value: "rygsaek", label: "Rygsæk" },
  ];

  // Predefined options for product conditions
  const productConditions = ["som ny", "let brugt", "brugt", "slidt"];

  // Predefined color options for the color picker
  const colors = [
    "#000000",
    "#5337FF",
    "#72CA81",
    "#7F8992",
    "#9E29BB",
    "#C1C1C1",
    "#FF3DD4",
    "#FF5757",
    "#FFB23F",
    "#FFE34E",
    "#FFFFFF",
  ];

  // Refs for managing drag behavior on the color picker
  const colorsRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Handle mouse down event for drag interaction
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - colorsRef.current.offsetLeft;
    scrollLeft.current = colorsRef.current.scrollLeft;
  };

  // Handle mouse leave event to stop drag interaction
  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  // Handle mouse up event to end drag interaction
  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Handle mouse move event for drag scrolling
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - colorsRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll faster
    colorsRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle color selection for the color picker
  const handleColorSelect = (color) => {
    setFormData((prevData) => ({
      ...prevData,
      color: color,
    }));
  };

  // Handle file change for the image upload
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Handle form submission to send data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({ text: "", type: "" });

    try {
      // Pass the form data and image directly to createProduct
      await createProduct({
        ...formData,
        image: imageFile,
      });

      toast.success("Produkt oprettet!");

      if (closeModal) {
        closeModal();
      }

      setFormData({
        name: "",
        product_type: "",
        size: "",
        color: "",
        product_condition: "",
        brand: "",
      });
      setImageFile(null);
    } catch (error) {
      toast.error("Noget gik galt. Prøv igen.");
      console.error("Error", error);
    }
  };

  return (
    <div className="mx-auto">
      <Image
        className="mx-auto my-8"
        src="/images/lendrlogo.png"
        alt="Product Image"
        width={200}
        height={300}
      />
      <div className="text-center text-black text-2xl my-5 font-bold font-['Amulya']">
        Opret produkt
      </div>
      {message.text && (
        <p
          className={`mb-4 ${
            message.type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {message.text}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 px-10 pb-[150px] pt-10 rounded-t-[50px] bg-[#E2F0E9]"
      >
        <h2 className="text-center text-black text-lg font-bold font-['Poppins']">
          Vælg type af produkt
        </h2>
        {/* Product Type */}
        <select
          name="product_type"
          value={formData.product_type}
          onChange={handleChange}
          required
          className="w-full h-[49px] bg-white rounded-[10px] text-center text-[#808080]"
        >
          <option value="">Produkt type</option>
          {productTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <h4 className="text-black text-lg font-bold font-['Amulya']">
          Indtast oplysninger
        </h4>
        {/* Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full mt-[-5px] h-[49px] pl-6 bg-white rounded-[10px] placeholder-[#808080] text-black"
        />

        {/* Brand */}
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Brand"
          className="w-full h-[49px] pl-6 bg-white rounded-[10px] placeholder-[#808080] text-black"
        />

        {/* Size and Product Condition */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="size"
            value={formData.size}
            onChange={handleChange}
            placeholder="Size in Liters"
            required
            className="w-full h-[49px] text-center bg-white rounded-[10px] text-[#808080]"
          />
          <select
            name="product_condition"
            value={formData.product_condition}
            onChange={handleChange}
            required
            className="w-full h-[49px] text-center bg-white rounded-[10px] text-[#808080]"
          >
            <option value="">Tilstand</option>
            {productConditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        {/* Color Picker */}
        <h4 className="text-[#031926] text-[17px] font-medium font-['Amulya']">
          Farve
        </h4>

        <div
          ref={colorsRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex items-center overflow-x-auto space-x-4 w-full h-14 cursor-grab"
        >
          {colors.map((colorOption) => (
            <div
              key={colorOption}
              onClick={() => handleColorSelect(colorOption)}
              className={`w-12 h-12 rounded-full cursor-pointer flex-shrink-0 border ${
                formData.color === colorOption
                  ? "border-black"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: colorOption }}
            ></div>
          ))}
        </div>
        {formData.color && (
          <p className="mt-2 text-black flex gap-2 items-center">
            Valgte farve:{" "}
            <span
              className="inline-block w-5 h-5 rounded-full"
              style={{ backgroundColor: formData.color }}
            ></span>
          </p>
        )}

        {/* Image Upload Field */}
        <h4 className="text-black text-lg font-bold font-['Amulya']">
          Upload billede
        </h4>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="w-full h-[49px] bg-white rounded-[10px] text-center text-[#808080]"
        />
        {imageFile && (
          <p className="mt-2 text-black">Selected file: {imageFile.name}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="h-[61px] mt-8 bg-[#5bad86] rounded-[20px] transition"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
