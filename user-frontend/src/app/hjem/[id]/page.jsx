import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function PostPage({ params }) {
  const { id } = params;

  // Mapping for color labels
  const colorLabels = {
    "#000000": "Sort",
    "#5337FF": "Blå",
    "#72CA81": "Grøn",
    "#7F8992": "Grå",
    "#9E29BB": "Lilla",
    "#C1C1C1": "Sølv",
    "#FF3DD4": "Pink",
    "#FF5757": "Rød",
    "#FFB23F": "Orange",
    "#FFE34E": "Gul",
    "#FFFFFF": "Hvid",
  };

  try {
    const res = await fetch(
      `http://localhost:4000/api/post/read/postid/index.php?id=${id}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch post details");
    }
    const post = await res.json();

    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-3 items-center justify-center">
          <Link href={"/hjem"}>
            <button className="justify-self-start text-gray-500 text-xs">
              ← Tilbage
            </button>
          </Link>
          <h4 className="text-xl font-bold text-gray-900 col-span-1 text-center text-nowrap justify-self-center truncate max-w-40">
            {post.product_name}
          </h4>
        </div>

        <div className="mt-4">
          <div className="bg-gray">
            <div className="w-full h-64 bg-gray-500 rounded-lg overflow-hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/api/product/create/${post.picture_path}`}
                alt={post.product_name}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-row gap-2 items-center">
              {/* Condition at the start */}
              <div className="flex items-center gap-1">
                <p className="font-semibold">Stand: </p>
                <p>{post.product_condition}</p>
              </div>

              {/* Spacer to create separation */}
              <div className="flex-grow"></div>

              {/* Color information at the end */}
              <div className="flex items-center justify-end rounded-lg px-4 py-2 mt-2">
                <span
                  className="w-3 h-3 rounded-full inline-block mr-2"
                  style={{
                    backgroundColor: post.color,
                  }}
                ></span>
                <span className="text-gray-600 text-sm">
                  {colorLabels[post.color]}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-5 items-center text-center">
            {/* Price */}
            <div>
              <p className="font-semibold">Dagspris</p>
              <p>{post.price_per_day} kr</p>
            </div>
            <Separator orientation="vertical" className="h-8 mx-auto" />

            {/* Location */}
            <div>
              <p className="font-semibold">Lokation</p>
              <p>København</p>
            </div>
            <Separator orientation="vertical" className="h-8 mx-auto" />

            {/* Size */}
            <div>
              <p className="font-semibold">Størrelse</p>
              <p>{post.size}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="font-semibold">Beskrivelse:</p>
            <div className="flex justify-center">
              <p className="mt-2 text-gray-700">{post.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <p className="text-red-500">Error loading post details.</p>;
  }
}
