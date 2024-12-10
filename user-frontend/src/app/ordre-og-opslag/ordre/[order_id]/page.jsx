import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { getSpecificOrder } from "@/actions/orders.actions";

export default async function Page({ params }) {
  // Get order_id from params
  const { order_id } = await params;

  // Fetch specific order using order_id
  const order = await getSpecificOrder(order_id);

  return (
    <div className="flex flex-col gap-6 bg-whitebg">
      <section className="bg-[#EFF1F5] pb-8 rounded-b-3xl">
        <div className="grid grid-cols-3 items-center w-11/12 mx-auto py-6">
          <Link
            href="/ordre-og-opslag"
            className="text-sm flex items-center gap-1"
          >
            <IoIosArrowBack /> <p>Tilbage</p>
          </Link>
          <h1 className="text-text text-xl font-bold text-center text-nowrap justify-self-center">
            {order.product_name}
          </h1>
        </div>
        <div className="w-10/12 mx-auto">
          <div className="w-full shadow-md rounded-lg">
            <Image
              className="rounded-lg w-full h-60 object-cover"
              src={`${process.env.NEXT_PUBLIC_API_URL}/api/product/create/${order.pictures[0]}`}
              alt={order.product_name}
              width={100}
              height={100}
            />
          </div>
        </div>
      </section>
      <section>
        <p>Status: {order.order_status}</p>
        <p>Pris: {order.price_per_day} kr./d.</p>
        <p>
          {order.start_date} - {order.end_date}
        </p>
        <p>Afhentning: {order.location}</p>
        <p>Destination: {order.destination}</p>
        <p>Depositum: {order.deposit} kr.</p>
      </section>
    </div>
  );
}
