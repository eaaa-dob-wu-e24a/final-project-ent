// app/components/Orders.jsx
import { Link } from "@remix-run/react";

export default function Orders({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-md p-6">
        <p className="text-center text-gray-500">No orders available.</p>
      </div>
    );
  }

  return (
    <div className="py-6 bg-gray-100 min-h-screen">
      <div className="mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Manage Orders
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {orders.map((order) => (
            <Link to={`/orders/${order.order_id}`} key={order.order_id}>
              <div className="bg-white border border-gray-200 flex flex-col justify-between rounded-lg shadow hover:shadow-lg transition-shadow p-4 cursor-pointer">
                <p className="font-semibold">Order ID: {order.order_id}</p>
                <p>Product Name: {order.product_name}</p>
                <p>Customer: {order.owner_id}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
