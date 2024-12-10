import { IoArrowDownCircle } from "react-icons/io5";
import { RxSewingPinFilled } from "react-icons/rx";
import Image from "next/image";
import { format } from "date-fns";
import { da } from "date-fns/locale";

export default function OrderCard({ order, color, iconStyles }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Parse the date string
    return format(date, "dd.MM.yyyy", { locale: da });
  };

  return (
    <div
      key={order.order_id}
      className="bg-white rounded-lg shadow-lg flex flex-col gap-4 p-4 overflow-hidden relative"
    >
      <svg
        className="absolute -right-2 top-0 h-48 w-[135px] object-cover pointer-events-none z-0"
        width="103"
        height="144"
        viewBox="0 0 103 144"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M79.4404 105.271C79.4404 103.566 79.0981 102.458 78.4135 101.947C77.9001 101.265 77.3012 100.412 76.6165 99.3891C70.6267 102.97 62.3265 104.76 51.716 104.76C37.5116 104.76 25.7033 100.071 16.2907 90.6939C6.02242 80.9756 0.888306 68.5294 0.888306 53.3554C0.888306 34.4304 6.79255 19.6825 18.601 9.1118C30.5806 -1.62939 45.8974 -7 64.5514 -7C86.2858 -7 103.399 0.416556 115.893 15.2496C128.557 30.0827 134.888 48.8373 134.888 71.5132C134.888 99.6448 127.273 121.468 112.042 136.983C96.9819 152.328 78.9269 160 57.877 160C44.6995 160 34.089 157.102 26.0455 151.306C18.0021 145.337 13.9803 137.154 13.9803 126.754C13.9803 118.74 16.034 112.347 20.1413 107.573C29.5537 113.37 39.1375 116.268 48.8923 116.268C58.8183 116.268 66.3483 115.33 71.4825 113.455C76.7876 111.58 79.4404 108.852 79.4404 105.271Z"
          fill={color}
        />
      </svg>
      <div className="flex gap-2">
        <p className={`text-white rounded-full px-2 text-xs ${iconStyles.bg}`}>
          {order.price_per_day}kr./d.
        </p>
        <p className="text-black font-medium text-xs">
          {formatDate(order.start_date)} - {formatDate(order.end_date)}
        </p>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex justify-center items-center ${iconStyles.iconBg}`}
          >
            <IoArrowDownCircle size={20} />
          </div>
          <svg
            width="2"
            height="45"
            viewBox="0 0 2 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 0L0.999998 45"
              stroke={iconStyles.line}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeDasharray="4 3"
            />
          </svg>
          <div
            className={`w-10 h-10 rounded-full flex justify-center items-center ${iconStyles.iconBg}`}
          >
            <RxSewingPinFilled size={20} />
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-black font-medium text-sm">{order.location}</p>
            <p className="text-gray-400 text-xs">Afhentningssted</p>
          </div>
          <div>
            <p className="text-black font-medium text-sm">
              {order.destination}
            </p>
            <p className="text-gray-400 text-xs">Destination</p>
          </div>
        </div>
      </div>
      <div className="absolute right-4 h-[85px] top-7 w-20">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/api/product/create/${order.pictures[0]}`}
          alt={order.product_name}
          width={150}
          height={150}
          className="object-cover h-full w-full rounded-2xl"
        />
      </div>
    </div>
  );
}
