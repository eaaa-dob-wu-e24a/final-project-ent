"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UpdateProduct({ product, updateProduct }) {
  const [name, setName] = useState(product.name);
  const [brand, setBrand] = useState(product.brand);
  const [color, setColor] = useState(product.color);
  const [size, setSize] = useState(product.size);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const colors = [
    { name: "Sort", hex: "#000000" },
    { name: "Blå", hex: "#5337FF" },
    { name: "Grøn", hex: "#72CA81" },
    { name: "Grå", hex: "#7F8992" },
    { name: "Lilla", hex: "#9E29BB" },
    { name: "Sølv", hex: "#C1C1C1" },
    { name: "Pink", hex: "#FF3DD4" },
    { name: "Rød", hex: "#FF5757" },
    { name: "Orange", hex: "#FFB23F" },
    { name: "Gul", hex: "#FFE34E" },
    { name: "Hvid", hex: "#FFFFFF" },
  ];

  const selectedColorName = colors.find((c) => c.hex === color)?.name;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId: product.product_id,
        name,
        brand,
        color,
        size,
        image,
      });
      setMessage({ type: "success", content: "Produktet er opdateret." });
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage({
        type: "error",
        content: "En fejl opstod under opdatering af produktet.",
      });
    }
  };

  if (message) {
    setTimeout(() => {
      setMessage("");
    }, 5000);
  }

  return (
    <>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="product_name"
          >
            Produkt Navn
          </label>
          <Input
            type="text"
            id="product_name"
            name="product_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="brand"
          >
            Brand
          </label>
          <Input
            type="text"
            id="brand"
            name="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div className="">
          <SelectGroup>
            <SelectLabel>Farve</SelectLabel>
            <Select onValueChange={(value) => setColor(value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder={selectedColorName} />
              </SelectTrigger>
              <SelectContent className="text-[#888D96]">
                <SelectItem value="#000000">
                  <p className="flex gap-4 items-center">
                    <span className="w-3 h-3 rounded-full bg-black"></span>
                    <span>Sort</span>
                  </p>
                </SelectItem>
                <SelectItem value="#5337FF">
                  <p className="flex gap-4 items-center">
                    <span className="w-3 h-3 rounded-full bg-[#5337FF]"></span>
                    <span>Blå</span>
                  </p>
                </SelectItem>
                <SelectItem value="#72CA81">
                  <p className="flex gap-4 items-center">
                    <span className="w-3 h-3 rounded-full bg-[#72CA81]"></span>
                    <span>Grøn</span>
                  </p>
                </SelectItem>
                <SelectItem value="#7F8992">
                  <p className="flex gap-4 items-center">
                    <span className="w-3 h-3 rounded-full bg-[#7F8992]"></span>
                    <span>Grå</span>
                  </p>
                </SelectItem>
                <SelectItem value="#9E29BB">
                  <p className="flex gap-4 items-center">
                    <span className="w-3 h-3 rounded-full bg-[#9E29BB]"></span>
                    <span>Lilla</span>
                  </p>
                </SelectItem>
                <SelectItem value="#C1C1C1">
                  <p className="flex gap-4 items-center">
                    <span className="w-3 h-3 rounded-full bg-[#C1C1C1]"></span>
                    <span>Sølv</span>
                  </p>
                </SelectItem>
                <SelectItem value="#FF3DD4">
                  <p className="flex gap-4 items-center">
                    <span className="w-3 h-3 rounded-full bg-[#FF3DD4]"></span>
                    <span>Pink</span>
                  </p>
                </SelectItem>
                <SelectItem value="#FF5757">
                  <p className="flex gap-4 items-center">
                    <span className="w-3 h-3 rounded-full bg-[#FF5757]"></span>
                    <span>Rød</span>
                  </p>
                </SelectItem>
                <SelectItem value="#FFB23F">
                  <p className="flex gap-4 items-center">
                    <span className="w-3 h-3 rounded-full bg-[#FFB23F]"></span>
                    <span>Orange</span>
                  </p>
                </SelectItem>
                <SelectItem value="#FFE34E">
                  <p className="flex gap-4 items-center">
                    <span className="w-3 h-3 rounded-full bg-[#FFE34E]"></span>
                    <span>Gul</span>
                  </p>
                </SelectItem>
                <SelectItem value="#FFFFFF">
                  <p className="flex gap-4 items-center">
                    <span className="w-3 h-3 rounded-full bg-white border border-gray-300"></span>
                    <span>Hvid</span>
                  </p>
                </SelectItem>
              </SelectContent>
            </Select>
          </SelectGroup>
        </div>
        <div className="">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="size"
          >
            Størrelse
          </label>
          <Input
            type="text"
            id="size"
            name="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </div>
        <div className="">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="image"
          >
            Billede
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-lightgreen file:text-darkgreen"
          />
        </div>
        <Button
          variant="default"
          size="medium"
          type="submit"
          className="text-base mt-4"
        >
          Opdater Produkt
        </Button>
      </form>
      {message && (
        <div
          className={`text-base text-center mt-4 ${
            message.type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {message.content}
        </div>
      )}
    </>
  );
}
