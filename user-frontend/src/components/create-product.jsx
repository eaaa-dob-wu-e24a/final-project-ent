/*===============================================
=          RELEVANT FILE NOW?           =
===============================================*/

"use client"; // Client component for handling user input and state

import { useState } from "react";
import { createProduct } from "../actions/product.actions";

export default function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    product_type: "",
    size: "",
    color: "",
    product_condition: "",
  });

  const [image, setImage] = useState(null); // State for image file
  const [status, setStatus] = useState(null);

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Save the selected file
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setStatus({ success: false, message: "Please upload an image" });
      return;
    }

    try {
      const result = await createProduct({ ...form, image }); // Pass the form data and image
      setStatus({ success: true, message: result.message });
      console.log("Product created successfully:", result.product_id);
    } catch (error) {
      setStatus({ success: false, message: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Product Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Brand</label>
        <input
          type="text"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Product Type</label>
        <select
          name="product_type"
          value={form.product_type}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="kuffert">Kuffert</option>
          <option value="vandrerygsaek">Vandrerygsæk</option>
          <option value="rygsæk">Rygsæk</option>
        </select>
      </div>

      <div>
        <label>Size</label>
        <input
          type="text"
          name="size"
          value={form.size}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Color</label>
        <input
          type="text"
          name="color"
          value={form.color}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Condition</label>
        <select
          name="product_condition"
          value={form.product_condition}
          onChange={handleChange}
          required
        >
          <option value="">Select Condition</option>
          <option value="som ny">Som Ny</option>
          <option value="let brugt">Let Brugt</option>
          <option value="brugt">Brugt</option>
          <option value="slidt">Slidt</option>
        </select>
      </div>

      <div>
        <label>Upload Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
      </div>

      <button type="submit">Create Product</button>

      {status && (
        <p style={{ color: status.success ? "green" : "red" }}>
          {status.message}
        </p>
      )}
    </form>
  );
}
