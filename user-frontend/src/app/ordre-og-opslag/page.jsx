import Image from "next/image";
import FilterSquare from "./components/filter-square";
import { getProducts } from "@/actions/products.actions";
import { getPosts } from "@/actions/posts.actions";
import { getUser } from "@/actions/users.actions";

export default async function Page() {
  const products = await getProducts();
  const posts = await getPosts();
  const user = await getUser();

  return (
    <>
      <section className="pt-10 pb-14 bg-lightgreen">
        <div className="flex w-10/12 mx-auto items-center justify-between">
        <h1 className="text-text font-bold text-4xl">
            <span>Ordre og</span>
            <br />
            <span>opslag</span>
          </h1>
          <Image
            className="rounded-full bg-white object-cover h-20 w-20"
            src={`${process.env.NEXT_PUBLIC_API_URL}/api/user/update/${user.profile_picture}` || "/images/noavatar.png"}
            alt="User Avatar"
            width={100}
            height={100}
          />
        </div>
      </section>
      <section className="bg-graybg pt-10 rounded-t-3xl -mt-4">
        <div className="w-10/12 mx-auto flex flex-col gap-2">
          <h2 className="font-bold">Tjek dine:</h2>
          <FilterSquare products={products} posts={posts} />
        </div>
      </section>
    </>
  );
}
