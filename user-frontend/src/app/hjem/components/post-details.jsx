import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import MyCalendar from "@/components/my-calendar";

export default function PostDetails({ post, colorLabels }) {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-3 items-center justify-center">
        <Link href={"/hjem"}>
          <button className="justify-self-start text-gray-500 text-xs">
            ← Tilbage
          </button>
        </Link>
        <h4 className="text-xl font-bold text-gray-900 col-span-1 text-center truncate max-w-40">
          {post.product.name}
        </h4>
      </div>
      <div className="mt-4">
        <div className="rounded-xl bg-gray-100 p-4">
          <div className="w-full h-64 bg-graybg rounded-lg overflow-hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/api/product/create/${post.product.pictures[0]}`}
              alt={post.product.name}
              width={300}
              height={300}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-row gap-2 items-center mt-2">
            <div className="flex items-center gap-1">
              <p className="font-semibold">Stand: </p>
              <p>{post.product.product_condition}</p>
            </div>
            <div className="flex-grow"></div>
            <div className="flex items-center justify-end rounded-lg px-4 py-2">
              <span
                className="w-3 h-3 rounded-full inline-block mr-2"
                style={{
                  backgroundColor: post.product.color,
                }}
              ></span>
              <span className="text-gray-600 text-sm">
                {colorLabels[post.product.color]}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-5 items-center text-center">
          <div>
            <p className="font-semibold">Dagspris</p>
            <p>{post.price_per_day} kr</p>
          </div>
          <Separator orientation="vertical" className="h-8 mx-auto" />
          <div>
            <p className="font-semibold">Lokation</p>
            <p>{post.location}</p>
          </div>
          <Separator orientation="vertical" className="h-8 mx-auto" />
          <div>
            <p className="font-semibold">Størrelse</p>
            <p>{post.product.size}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="font-semibold">Beskrivelse:</p>
          <div className="flex">
            <p className="mt-2 text-gray-500">{post.description}</p>
          </div>
        </div>
      </div>
      <MyCalendar />
    </div>
  );
}
