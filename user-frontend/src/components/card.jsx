// Card.jsx
"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductList({ posts, loading, error }) {
  if (loading) {
    return <p className="text-center">Indlæser opslag...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!posts || posts.length === 0) {
    return <p className="text-center">Ingen opslag fundet.</p>;
  }

  return (
    <div className="w-full z-0 flex px-5 flex-col space-y-4 mx-auto">
      {posts.map((post) => (
        <Link
          href={`/hjem/${post.id}`}
          key={post.id}
          className="relative py-3 bg-white rounded-lg shadow-lg flex flex-col items-start overflow-hidden"
        >
          {/* Decorative SVG */}
          <svg
            className="absolute right-[-8px] top-0 h-48 w-[150px] object-cover pointer-events-none"
            width="103"
            height="144"
            viewBox="0 0 103 144"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M79.4404 105.271C79.4404 103.566 79.0981 102.458 78.4135 101.947C77.9001 101.265 77.3012 100.412 76.6165 99.3891C70.6267 102.97 62.3265 104.76 51.716 104.76C37.5116 104.76 25.7033 100.071 16.2907 90.6939C6.02242 80.9756 0.888306 68.5294 0.888306 53.3554C0.888306 34.4304 6.79255 19.6825 18.601 9.1118C30.5806 -1.62939 45.8974 -7 64.5514 -7C86.2858 -7 103 8.28583 103 30.8571C103 53.4284 86.2858 68.7143 64.5514 68.7143C45.8974 68.7143 30.5806 63.3439 18.601 52.6027C6.79255 41.8615 0.888306 27.1136 0.888306 8.18857C0.888306 -6.98543 6.02242 -19.4316 16.2907 -29.1499C25.7033 -38.527 37.5116 -43.216 51.716 -43.216C62.3265 -43.216 70.6267 -41.426 76.6165 -37.8449C77.3012 -38.8678 77.9001 -39.7201 78.4135 -40.4029C79.0981 -40.9138 79.4404 -42.0216 79.4404 -43.7266V-7.00001H103V105.271H79.4404Z"
              fill="#FF7127"
            />
          </svg>

          {/* Product Image */}
          <div className="absolute right-[10px] h-[100px] top-4 z-10 w-[100px] flex-shrink-0">
            <Image
              src={post.image}
              alt={post.title}
              className="object-cover h-full w-full rounded-[30px]"
              width={100}
              height={100}
            />
          </div>

          {/* Product Details */}
          <div className="pl-5 p-1 grid gap-4 relative z-10">
            <h3 className="text-xl pt-2 text-[#060606] font-bold">
              {post.title}
            </h3>
            <div className="grid gap-1">
              <p className="text-[#888D96] text-xs">
                <span className="font-medium">Tilstand:</span> {post.condition}
              </p>
              <p className="text-[#888D96] text-xs">
                <span className="font-medium">Størrelse:</span> {post.size}
              </p>
              <p className="flex items-center text-gray-600 text-xs">
                <span
                  className="w-3 h-3 rounded-full inline-block mr-2"
                  style={{ backgroundColor: post.colorCode }}
                ></span>
                {post.colorLabel}
              </p>
              <p className="text-[#888D96] text-xs">
                <span className="font-medium">Pris pr. dag:</span>{" "}
                {post.price_per_day}
              </p>
              <p className="text-[#888D96] text-xs">
                <span className="font-medium">Beskrivelse:</span>{" "}
                {post.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
