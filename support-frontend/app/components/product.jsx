// app/components/Products.jsx
import { Link } from "@remix-run/react";

export default function Products({ products, backendUrl }) {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-md p-6">
        <p className="text-center text-gray-500">No products available.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Product Overview</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <li
            key={product.product_id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <Link
              to={`/products/${product.product_id}`}
              className="block h-full"
            >
              {product.pictures[0] ? (
                <img
                  src={`${backendUrl}/api/product/create/${product.pictures[0]}`}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Size:</span> {product.size}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Color:</span> {product.color}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Condition:</span>{" "}
                  {product.product_condition}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Brand:</span> {product.brand}
                </p>
                <p className="text-xs text-gray-500">
                  Posted by User ID: {product.user_id}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
