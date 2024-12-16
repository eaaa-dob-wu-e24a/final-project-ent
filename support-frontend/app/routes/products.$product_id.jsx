// app/routes/products.$product_id.jsx
import { useLoaderData, Link, useFetcher } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getAccessToken } from "../utils/setCookies";

export const loader = async ({ request, params }) => {
  const accessToken = await getAccessToken(request);

  if (!accessToken) {
    return redirect("/login");
  }

  const { product_id } = params;

  // Fetch product data from the backend
  const customUserAgent = "MinUserAgent/1.0";
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/product/read/?product_id=${product_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "user-agent": customUserAgent,
      },
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch product data:", await response.text());
    throw new Response("Failed to fetch product data", {
      status: response.status,
    });
  }

  const product = await response.json();

  if (!product || !product.product_id) {
    throw new Response("Product not found", { status: 404 });
  }

  // Modify picture URLs
  if (product.pictures && Array.isArray(product.pictures)) {
    product.pictures = product.pictures.map(
      (pic) => `${process.env.BACKEND_URL}/api/product/create/${pic}`
    );
  }

  return json({ product });
};

export const action = async ({ request, params }) => {
  const accessToken = await getAccessToken(request);
  const { product_id } = params;

  if (!accessToken) {
    return redirect("/login");
  }

  const formData = await request.formData();

  // Extract form data for updating the product
  const data = {
    name: formData.get("name"),
    size: formData.get("size"),
    color: formData.get("color"),
    product_condition: formData.get("product_condition"),
    brand: formData.get("brand"),
    // Add other fields as necessary
  };

  // Send update request to the backend
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/product/update/?product_id=${product_id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    console.error("Failed to update product:", await response.text());
    throw new Response("Failed to update product", {
      status: response.status,
    });
  }

  // Redirect to the updated product page
  return redirect(`/products/${product_id}`);
};

export default function ProductDetail() {
  const { product } = useLoaderData();
  const fetcher = useFetcher();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <Link to="/productpage" className="text-blue-500 hover:underline">
        ← Back to Products
      </Link>

      <div className="mt-4">
        {/* Product Images */}
        {product.pictures && product.pictures.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto">
            {product.pictures.map((picture, index) => (
              <img
                key={index}
                src={picture}
                alt=""
                className="w-64 h-64 object-cover rounded-md"
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md">
            <span className="text-gray-500">No Images Available</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Size:</span> {product.size}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Color:</span> {product.color}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Condition:</span>{" "}
              {product.product_condition}
            </p>
          </div>
          <div>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Brand:</span> {product.brand}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Product Type:</span>{" "}
              {product.product_type}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Posted by User ID:</span>{" "}
              {product.user_id}
            </p>
          </div>
        </div>
      </div>

      {/* Update Product Form */}
      <fetcher.Form method="post" className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Update Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              name="name"
              type="text"
              defaultValue={product.name}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="size"
            >
              Size
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="size"
              name="size"
              type="text"
              defaultValue={product.size}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="color"
            >
              Color
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="color"
              name="color"
              type="text"
              defaultValue={product.color}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="brand"
            >
              Brand
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="brand"
              name="brand"
              type="text"
              defaultValue={product.brand}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="product_condition"
            >
              Condition
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="product_condition"
              name="product_condition"
              type="text"
              defaultValue={product.product_condition}
            />
          </div>
          {/* Add more fields as needed */}
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Product
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}
