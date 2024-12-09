// src/components/post-form.jsx
"use client";

import { useState } from "react";
import useMyProducts from "../hooks/useMyProducts"; // Adjust the path if necessary
import { Button } from "./ui/button";
import { createPost } from "../helpers/posts"; // Import createPost
import { toast } from "react-hot-toast";

function PostForm({ closeModal }) {
  const [formData, setFormData] = useState({
    description: "",
    price_per_day: "",
    product_id: "",
    location: "",
  });

  const { myProducts, loading, error } = useMyProducts();

  // Handler for input changes (description, price_per_day, and location)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler for selecting a product
  const handleProductSelect = (productId) => {
    setFormData({ ...formData, product_id: productId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (
      !formData.description ||
      !formData.price_per_day ||
      !formData.product_id ||
      !formData.location
    ) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      // Pass the form data directly to createPost
      await createPost({
        ...formData,
      });

      // Handle success messages
      toast.success("Opslag oprettet!");

      // Optionally, reset the form
      setFormData({
        description: "",
        price_per_day: "",
        product_id: "",
        location: "",
      });

      if (closeModal) {
        closeModal();
      }
    } catch (error) {
      toast.error("Noget gik galt. Prøv igen.");
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="flex flex-col py-12 items-center h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold text-green-600">Create a Post</h2>
      <form
        className="flex flex-col gap-4 w-96 p-6 bg-white rounded shadow-md mt-4"
        onSubmit={handleSubmit}
      >
        {/* Product selection as a clickable list */}
        <div>
          <label className="block mb-2 font-semibold">Select a Product:</label>
          {loading ? (
            <p>Loading your products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : myProducts.length === 0 ? (
            <p>You have no products to create a post for.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 max-h-64 overflow-y-auto">
              {myProducts.map((product) => (
                <li
                  key={product.id}
                  onClick={() => handleProductSelect(product.id)}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100 ${
                    formData.product_id === product.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 relative mr-4 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-cover h-full w-full rounded-[30px]"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col">
                    <span className="font-semibold">{product.name}</span>
                    <span className="text-sm text-gray-600">
                      Size: {product.size} | Color: {product.colorLabel}
                    </span>
                    <span className="text-sm text-gray-600">
                      Brand: {product.brand}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Description */}
        <div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>
        {/* Price per day */}
        <div>
          <input
            type="number"
            name="price_per_day"
            value={formData.price_per_day}
            onChange={handleInputChange}
            placeholder="Price per day"
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
        </div>

        {/* Location */}
        <div>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Location"
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Submit button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={loading || myProducts.length === 0}
        >
          Create Post
        </Button>
      </form>
    </div>
  );
}

export default PostForm;
