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
          <svg
            className="absolute -right-14 -top-3 object-cover h-60 w-52"
            width="115"
            height="142"
            viewBox="0 0 115 142"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M67.0615 95.4641C67.0615 94.0144 66.7709 93.0721 66.1897 92.6371C65.7539 92.0573 65.2454 91.3325 64.6642 90.4626C59.579 93.507 52.5325 95.0292 43.5246 95.0292C31.4656 95.0292 21.4407 91.0425 13.4498 83.069C4.73245 74.8056 0.373779 64.2226 0.373779 51.3202C0.373779 35.2283 5.38626 22.6881 15.4112 13.6999C25.5814 4.56663 38.5848 0 54.4214 0C72.873 0 87.4019 6.30629 98.008 18.9188C108.76 31.5314 114.135 47.4784 114.135 66.7597C114.135 90.68 107.67 109.237 94.7391 122.429C81.9536 135.477 66.6256 142 48.755 142C37.5678 142 28.5599 139.536 21.7313 134.607C14.9027 129.532 11.4884 122.574 11.4884 113.731C11.4884 106.917 13.2319 101.481 16.7188 97.4212C24.7097 102.35 32.8459 104.815 41.1274 104.815C49.5542 104.815 55.9468 104.017 60.3055 102.423C64.8094 100.828 67.0615 98.5086 67.0615 95.4641Z"
              fill="#5BAD86"
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
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
