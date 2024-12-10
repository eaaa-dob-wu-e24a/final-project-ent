// app/components/Products.jsx
import { Link } from "@remix-run/react";
import PropTypes from "prop-types";

export default function Products({ products, layout = "grid" }) {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-md p-6">
        <p className="text-center text-gray-500">No products available.</p>
      </div>
    );
  }

  // Define class names based on the layout prop
  const containerClasses =
    layout === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      : "flex gap-4 overflow-x-auto whitespace-nowrap";

  const itemClasses =
    layout === "grid"
      ? "bg-white border border-gray-200 rounded-lg shadow p-4"
      : "shrink-0 w-60 bg-white border border-gray-200 rounded-lg shadow p-4";

  return (
    <div className="w-full max-w-[1200px] py-4">
      <h4 className="text-xl font-semibold mb-4">Products</h4>
      <ul className={containerClasses}>
        {products.map((product) => (
          <li key={product.product_id} className={itemClasses}>
            <Link to={`/products/${product.product_id}`} className="block">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Type: {product.product_type}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Size: {product.size}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Color: {product.color}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Condition: {product.product_condition}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Brand: {product.brand}
                </p>
                <p className="text-gray-600 text-sm">
                  Posted by User ID: {product.user_id}
                </p>
                {product.pictures.length > 0 && (
                  <img
                    src={product.pictures[0]}
                    alt={product.name}
                    className="mt-2 w-full h-40 object-cover rounded"
                  />
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

Products.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      product_id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      product_type: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      product_condition: PropTypes.string.isRequired,
      brand: PropTypes.string.isRequired,
      user_id: PropTypes.string.isRequired,
      pictures: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  layout: PropTypes.oneOf(["flex", "grid"]),
};
