// src/components/post-form.jsx
"use client";

import { useState } from "react";
import useMyProducts from "../hooks/useMyProducts"; // Adjust the path if necessary
import { Button } from "./ui/button";
import { createPost } from "../helpers/posts"; // Import createPost
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="">
      <Image
        className="mx-auto my-8"
        src="/images/lendrlogo.png"
        alt="Product Image"
        width={200}
        height={300}
      />
      <h2 className="text-center text-text text-2xl my-5 font-bold font-heading">
        Opret opslag
      </h2>
      <form
        className="flex flex-col gap-4 w-full p-6 pb-40 rounded shadow-md mt-4 rounded-t-3xl bg-lightgreen"
        onSubmit={handleSubmit}
      >
        {/* Product selection as a clickable list */}
        <div>
          <p className="font-semibold mb-6 text-xl text-center">
            Vælg produkt:
          </p>
          {loading ? (
            <p>Loading your products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : myProducts.length === 0 ? (
            <p>You have no products to create a post for.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {myProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product.id)}
                  className={`flex items-center border rounded-lg cursor-pointer bg-white h-20 gap-4 ${
                    formData.product_id === product.id
                      ? "border-darkgreen"
                      : "border-none"
                  }`}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="object-cover h-full w-20 rounded-l-lg"
                    width={64}
                    height={64}
                  />

                  {/* Product Details */}
                  <div className="flex flex-col">
                    <span className="font-semibold">{product.name}</span>
                    <span className="text-sm text-gray-600">
                      Størrelse: {product.size} | Farve: {product.colorLabel}
                    </span>
                    <span className="text-sm text-gray-600">
                      Brand: {product.brand}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Input
          type="number"
          name="price_per_day"
          value={formData.price_per_day}
          onChange={handleInputChange}
          placeholder="Pris pr. dag"
          required
          className="w-full py-2 h-12 placeholder-gray-500 text-text"
          min="0"
          step="0.01"
        />
        <Input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Lokalitet"
          required
          className="w-full py-2 h-12 placeholder-gray-500 text-text"
        />
        <div>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Skriv din beskrivelse her..."
            required
            className="w-full"
            rows="4"
          />
        </div>
        {/* Submit button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={loading || myProducts.length === 0}
        >
          Opret opslag
        </Button>
      </form>
    </div>
  );
}

export default PostForm;
