// components/ProductForm.js

"use client";
import { useState } from "react";

function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    product_type: "",
    size: "",
    color: "",
    product_condition: "",
    brand: "",
  });

  const [message, setMessage] = useState("");

  // Preset options for product_type and product_condition
  const productTypes = ["kuffert", "vandrerygsæk", "rygsæk"];
  const productConditions = ["som ny", "let brugt", "brugt", "slidt"];

  // Preset colors for the color picker
  const colors = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FFA500", // Orange
    "#800080", // Purple
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send
    const data = {
      name: formData.name,
      product_type: formData.product_type,
      size: formData.size,
      color: formData.color,
      product_condition: formData.product_condition,
      brand: formData.brand || null, // brand is optional
    };

    try {
      const response = await fetch("http://localhost:4000/api/post/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // Include cookies if needed
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        // Optionally, reset the form
        setFormData({
          name: "",
          product_type: "",
          size: "",
          color: "",
          product_condition: "",
          brand: "",
        });
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setMessage(
        "An error occurred while creating the product. Please try again later."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create a New Product</h2>

      {message && <p className="mb-4">{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Product Type */}
        <div className="mb-4">
          <label className="block text-gray-700">Product Type:</label>
          <select
            name="product_type"
            value={formData.product_type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select a product type</option>
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div className="mb-4">
          <label className="block text-gray-700">Size:</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
            className="w-full text-black px-3 py-2 border rounded"
          />
        </div>

        {/* Color Picker */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Color:</label>
          <div className="flex space-x-2">
            {colors.map((colorOption) => (
              <div
                key={colorOption}
                onClick={() => handleColorSelect(colorOption)}
                style={{
                  backgroundColor: colorOption,
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  border:
                    formData.color === colorOption
                      ? "3px solid black"
                      : "1px solid gray",
                  cursor: "pointer",
                }}
                title={colorOption}
              ></div>
            ))}
          </div>
          {formData.color && (
            <p className="mt-2">
              Selected Color:{" "}
              <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  backgroundColor: formData.color,
                  borderRadius: "50%",
                }}
              ></span>
            </p>
          )}
        </div>

        {/* Product Condition */}
        <div className="mb-4">
          <label className="block text-gray-700">Condition:</label>
          <select
            name="product_condition"
            value={formData.product_condition}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select product condition</option>
            {productConditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        {/* Brand (Optional) */}
        <div className="mb-4">
          <label className="block text-gray-700">Brand (Optional):</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
