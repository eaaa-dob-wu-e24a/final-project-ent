import React from "react";

export default function ProductList() {
  const products = [
    {
      id: 1,
      title: "ADAX KUFFERT",
      condition: "Som ny",
      size: "80 L",
      color: "Sort",
      status: "Aktivt opslag",
      image: "../public/dummypicture.webp", // Replace with your placeholder image
    },
  ];

  return (
    <div>
      <div className="space-y-4 min-w-[300px]">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative bg-white rounded-lg shadow-lg p-6 flex items-center overflow-hidden "
          >
            <svg
              className="absolute right-0 top-0 h-full w-auto object-cover pointer-events-none"
              width="103"
              height="144"
              viewBox="0 0 103 144"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M79.4404 105.271C79.4404 103.566 79.0981 102.458 78.4135 101.947C77.9001 101.265 77.3012 100.412 76.6165 99.3891C70.6267 102.97 62.3265 104.76 51.716 104.76C37.5116 104.76 25.7033 100.071 16.2907 90.6939C6.02242 80.9756 0.888306 68.5294 0.888306 53.3554C0.888306 34.4304 6.79255 19.6825 18.601 9.1118C30.5806 -1.62939 45.8974 -7 64.5514 -7C86.2858 -7 103.399 0.416556 115.893 15.2496C128.557 30.0827 134.888 48.8373 134.888 71.5132C134.888 99.6448 127.273 121.468 112.042 136.983C96.9819 152.328 78.9269 160 57.877 160C44.6995 160 34.089 157.102 26.0455 151.306C18.0021 145.337 13.9803 137.154 13.9803 126.754C13.9803 118.74 16.034 112.347 20.1413 107.573C29.5537 113.37 39.1375 116.268 48.8923 116.268C58.8183 116.268 66.3483 115.33 71.4825 113.455C76.7876 111.58 79.4404 108.852 79.4404 105.271Z"
                fill="#FF7127"
              />
            </svg>

            <div className="flex-1 relative">
              <h3 className="text-xl text-gray-600 font-bold">
                {product.title}
              </h3>
              <p className="text-gray-600">
                <span className="font-semibold">Tilstand:</span>{" "}
                {product.condition}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Størrelse:</span> {product.size}
              </p>
              <p className="flex items-center text-gray-600">
                <span className="w-4 h-4 bg-black rounded-full inline-block mr-2"></span>
                {product.color}
              </p>
              <p className="text-green-500 font-semibold">{product.status}</p>
            </div>

            {/* Image */}
            <div className="relative z-10 w-20 h-20 flex-shrink-0">
              <img
                src={product.image}
                alt={product.title}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
