import react from "react";
import { FaHouse, FaBookmark, FaUserLarge, FaPlus } from "react-icons/fa6";
import { PiHandbagSimpleFill } from "react-icons/pi";

export default function Navigation() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-4 py-1">
      <button className="flex flex-col items-center text-gray-400">
        <FaHouse size={30} />
      </button>

      <button className="flex flex-col items-center text-gray-400">
        <FaBookmark size={25} />
      </button>

      <button className="w-20 h-20 bg-[#53BF6D] text-white rounded-full flex items-center justify-center shadow-lg -translate-y-9">
        <span className="text-2xl">
          <FaPlus size={24} />
        </span>
      </button>

      <button className="flex flex-col items-center text-gray-400">
        <PiHandbagSimpleFill size={30} />
      </button>

      <button className="flex flex-col items-center text-gray-400">
        <FaUserLarge size={24} />
      </button>
    </footer>
  );
}
