// app/routes/OrderPage.jsx
import { useState } from "react";
import { json } from "@remix-run/node";
import { fetchOrders } from "../utils/order_util";
import Orders from "../components/orders";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const orders = await fetchOrders(request);
  return json({ orders });
};

export default function OrderPage() {
  const { orders } = useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.product_name.toLowerCase().includes(query) ||
      order.order_id.toString().includes(query)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Søg i ordre</h1>
      <input
        type="text"
        placeholder="Søg efter produkt ID eller navn..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <Orders orders={filteredOrders} layout="grid" />
    </div>
  );
}
