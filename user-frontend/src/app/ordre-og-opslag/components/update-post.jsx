"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UpdatePost({ post, updatePost }) {
  const [description, setDescription] = useState(post.description);
  const [price, setPrice] = useState(post.price_per_day);
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost({
        post_id: post.post_id,
        description,
        price,
        image,
      });
      toast.success("Opslag opdateret!");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Noget gik galt. Prøv igen.");
    }
  };

  return (
    <>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="price_per_day"
          >
            Pris per dag
          </label>
          <Input
            type="number"
            id="price"
            name="price_per_day"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="description"
          >
            Beskrivelse
          </label>
          <Textarea
            className="h-32"
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          Opdater opslag
        </Button>
      </form>
    </>
  );
}
