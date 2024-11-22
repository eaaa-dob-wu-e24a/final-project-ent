"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { createProduct } from "../actions/product.actions"; // Import the createProduct function

function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    product_type: "",
    size: "",
    color: "",
    product_condition: "",
    brand: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  const productTypes = ["kuffert", "vandrerygsaek", "rygsaek"];
  const productConditions = ["som ny", "let brugt", "brugt", "slidt"];

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

  const colorsRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - colorsRef.current.offsetLeft;
    scrollLeft.current = colorsRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - colorsRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll faster
    colorsRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleColorSelect = (color) => {
    setFormData((prevData) => ({
      ...prevData,
      color: color,
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send form data and the image file
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("product_type", formData.product_type);
    formDataToSend.append("size", formData.size);
    formDataToSend.append("color", formData.color);
    formDataToSend.append("product_condition", formData.product_condition);
    formDataToSend.append("brand", formData.brand || "");
    formDataToSend.append("image", imageFile);

    try {
      const result = await createProduct(formDataToSend);

      if (result.success) {
        setMessage(result.message);
        // Reset form fields if needed
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage("An error occurred while creating the product.");
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
      {message && <p className="mb-4 text-red-500">{message}</p>}

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
            <option key={type} value={type}>
              {type}
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
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            placeholder="Size"
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
