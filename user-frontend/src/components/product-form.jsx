"use client";

/*===============================================
=   This component creates product for user - Its imported in the navigation.jsx  =
===============================================*/

import { useState, useRef } from "react";
import Image from "next/image";
import { createProduct } from "../helpers/products"; // Corrected import statement
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      <div className="text-center text-text text-2xl my-5 font-bold font-heading">
        Opret produkt
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 px-8 pb-[150px] pt-10 rounded-t-3xl bg-[#E2F0E9]"
      >
        {/* <h2 className="text-center text-text text-lg font-semibold">
          Vælg type af produkt
        </h2> */}
        <SelectGroup>
          <Select
            value={formData.product_type}
            onValueChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                product_type: value,
              }))
            }
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Produkt type" />
            </SelectTrigger>
            <SelectContent className="text-gray-500">
              {productTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SelectGroup>

        {/* <h4 className="text-text text-lg font-semibold text-center ">
          Indtast oplysninger
        </h4> */}
        {/* Product Name */}
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Produkt navn"
          required
          className="w-full mt-[-5px] h-12 bg-white placeholder-gray-500 text-text"
        />
        {/* Brand */}
        <Input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Produkt brand"
          className="w-full bg-white h-12 placeholder-gray-500 text-text"
        />

        {/* Size and Product Condition */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            name="size"
            value={formData.size}
            onChange={handleChange}
            placeholder="Størrelse i liter"
            required
            className="w-full h-12 bg-white text-text placeholder-gray-500"
          />
          <SelectGroup>
            <Select
              value={formData.product_condition}
              onValueChange={(value) =>
                setFormData((prevData) => ({
                  ...prevData,
                  product_condition: value,
                }))
              }
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Tilstand" />
              </SelectTrigger>
              <SelectContent className="text-gray-500">
                {productConditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SelectGroup>
        </div>

        {/* Color Picker */}
        <div className="overflow-hidden flex flex-col gap-2">
          <h4 className="text-[#031926] text-lg font-semibold">Farve</h4>

          <div
            ref={colorsRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex items-center overflow-x-auto space-x-2 w-full h-14 cursor-grab no-scrollbar"
          >
            {colors.map((colorOption) => (
              <div
                key={colorOption}
                onClick={() => handleColorSelect(colorOption)}
                className={`w-10 h-10 rounded-full cursor-pointer flex-shrink-0 border ${
                  formData.color === colorOption
                    ? "border-black"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: colorOption }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <p className="italic text-sm text-text">Scroll til siden...</p>
            {formData.color && (
              <p className=" text-text text-sm flex gap-2 items-center">
                Valgt farve:
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: formData.color }}
                ></span>
              </p>
            )}
          </div>
        </div>

        {/* Image Upload Field */}
        <div className="flex flex-col gap-2">
          <h4 className="text-text text-lg font-bold font-['Amulya']">
            Upload billede
          </h4>
          <Input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full text-sm h-12 text-gray-500 p-0
              file:mr-2 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm
              file:bg-white file:text-text bg-transparent border-none"
          />
        </div>

        {/* Submit Button */}
        <Button variant="default" size="lg" type="submit" className="">
          Opret produkt
        </Button>
      </form>
    </div>
  );
}

export default ProductForm;
