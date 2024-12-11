// app/routes/orders/$order_id.jsx
import { useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { fetchOrder } from "../utils/order_util";

export const loader = async ({ params, request }) => {
  try {
    const order = await fetchOrder(params.order_id, request);
    return json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return json({ order: null });
  }
};

export default function OrderDetail() {
  const { order } = useLoaderData();

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-100 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4 text-red-600">
          Order Not Found
        </h1>
        <p className="text-red-700">
          The order you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Information */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Product Information</h2>
          <p className="mb-1">
            <strong>Product Name:</strong> {order.product_name}
          </p>
          <p className="mb-1">
            <strong>Product ID:</strong> {order.product_id}
          </p>
          <p className="mb-1">
            <strong>Brand:</strong> {order.brand}
          </p>
          <p className="mb-1">
            <strong>Color:</strong> {order.color}
          </p>
          <p className="mb-1">
            <strong>Size:</strong> {order.size}
          </p>
          {order.product_pictures && order.product_pictures.length > 0 && (
            <div className="mt-4">
              <strong>Product Images:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {order.product_pictures.map((picture, index) => (
                  <img
                    key={index}
                    src={picture.url}
                    alt=""
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Customer Information */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Customer Information</h2>
          <p className="mb-1">
            <strong>Owner ID:</strong>{" "}
            <Link
              to={`/users/${order.owner_id}`}
              className="text-blue-500 hover:underline"
            >
              {order.owner_id}
            </Link>
          </p>

          <p className="mb-1">
            <strong>Renter ID:</strong>{" "}
            <Link
              to={`/users/${order.renter_id}`}
              className="text-blue-500 hover:underline"
            >
              {order.renter_id}
            </Link>
          </p>
        </div>

        {/* Order Information */}
        <div className="bg-white p-4 rounded-lg shadow col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Order Information</h2>
          <p className="mb-1">
            <strong>Order ID:</strong> {order.order_id}
          </p>
          <p className="mb-1">
            <strong>Start dato:</strong>{" "}
            {new Date(order.start_date).toLocaleDateString()}
          </p>
          <p className="mb-1">
            <strong>Slut dato:</strong>{" "}
            {new Date(order.end_date).toLocaleDateString()}
          </p>
          <p className="mb-1">
            <strong>Status:</strong> {order.order_status}
          </p>
          <p className="mb-1">
            <strong>Lokation:</strong> {order.location}
          </p>
          <p className="mb-1">
            <strong>Destination:</strong> {order.destination}
          </p>
          <p className="mb-1">
            <strong>Leje periode:</strong> {order.rental_period} days
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-white p-4 rounded-lg shadow col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Payment Details</h2>

          <p className="mb-1">
            <strong>Depositum:</strong> {order.deposit} kr,-
          </p>
          <p className="mb-1">
            <strong>Pris pr. dag:</strong> {order.price_per_day} kr,- pr. dag
          </p>
        </div>
      </div>
    </div>
  );
}
