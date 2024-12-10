"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import MyCalendar from "@/components/my-calendar";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function PostDetails({ post, colorLabels, createOrder }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rentalPeriod, setRentalPeriod] = useState(0);
  const [destination, setDestination] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const postId = post.post_id;
  const router = useRouter();

  const handleRentalPeriodChange = (days) => {
    setRentalPeriod(days);
  };

  const handleDateRangeChange = (from, to) => {
    setStartDate(from);
    setEndDate(to);

    if (from && to) {
      const daysDiff = Math.ceil((to - from) / (1000 * 3600 * 24)) + 1;
      setRentalPeriod(daysDiff);
    } else {
      setRentalPeriod(0);
    }
  };

  const handleSendRequest = async () => {
    if (rentalPeriod <= 0) {
      setError("Vælg venligst en gyldig lejeperiode.");
      return;
    }

    if (!postId) {
      setError("Post ID er ugyldigt.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await createOrder({
      rental_period: rentalPeriod,
      order_status: "afventer",
      post_id: postId,
      start_date: startDate.toLocaleDateString("da-DK"),
      end_date: endDate.toLocaleDateString("da-DK"),
      destination: destination,
    });

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      toast.success("Forespørgsel sendt!");
      router.push("/hjem");
    }
  };

  return (
    <div className="mx-auto bg-white rounded-lg">
      <div className="">
        <div className="rounded-b-2xl bg-gray-100">
          <div className=" w-11/12 mx-auto">
            <div className="grid grid-cols-3 items-center justify-center py-4">
              <Link href={"/hjem"}>
                <button className="justify-self-start text-gray-500 text-sm">
                  ← Tilbage
                </button>
              </Link>
              <h4 className="text-xl font-bold text-gray-900 col-span-1 text-center justify-self-center truncate w-44">
                {post.product.name}
              </h4>
            </div>
            <div className="w-full h-64 bg-graybg rounded-lg overflow-hidden shadow-md">
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
        </div>

        <div className="w-11/12 mx-auto flex flex-col gap-6">
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
          <div className="">
            <p className="font-semibold">Beskrivelse:</p>
            <div className="flex">
              <p className="mt-2 text-gray-500">{post.description}</p>
            </div>
          </div>
          <MyCalendar
            onRentalPeriodChange={handleRentalPeriodChange}
            onDateRangeChange={handleDateRangeChange}
          />

          <Input
            type="text"
            placeholder="Skriv din destination her..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}

          <div className="pt-5">
            <button
              className="w-full bg-darkgreen text-white rounded-lg p-2 mt-4"
              onClick={handleSendRequest}
              disabled={isLoading}
            >
              {isLoading ? "Sender forespørgsel..." : "Send Forespørgsel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
