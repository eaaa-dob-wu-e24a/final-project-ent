import React from "react";
import Image from "next/image";

export default async function PostPage({ params }) {
  const { id } = params;

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
          <button className="justify-self-start">← Tilbage</button>
          <h2 className="text-3xl font-bold text-gray-900 col-span-1 text-center">
            {post.product_name}
          </h2>
        </div>

        <div className="mt-4">
          {/* Product Image */}
          <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/api/product/create/${post.picture_path}`}
              alt={post.product_name}
              width={300}
              height={300}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Product Details */}
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              <p>
                <span className="font-bold">Price per day:</span>{" "}
                {post.price_per_day} kr
              </p>
              <p>
                <span className="font-bold">Location:</span> København
              </p>
              <p>
                <span className="font-bold">Condition:</span>{" "}
                {post.product_condition}
              </p>
              <p>
                <span className="font-bold">Size:</span> {post.size}
              </p>
              <p>
                <span className="font-bold">Color:</span> {post.color}
              </p>
              <p>
                <span className="font-bold">Brand:</span> {post.brand}
              </p>
            </div>

            <h2 className="mt-6 text-xl font-semibold">Description</h2>
            <p className="mt-2 text-gray-700">{post.description}</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <p className="text-red-500">Error loading post details.</p>;
  }
}
