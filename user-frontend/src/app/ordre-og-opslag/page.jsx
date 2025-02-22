import FilterSquare from "./components/filter-square";
import { getUserProducts } from "@/actions/products.actions";
import { getUserPosts } from "@/actions/posts.actions";
import {
  getUserOwnerOrders,
  getUserRenterOrders,
} from "@/actions/orders.actions";

import ProfilePicture from "@/components/profile-picture";

export default async function Page() {
  const products = await getUserProducts();
  const posts = await getUserPosts();
  const ownerOrders = await getUserOwnerOrders();
  const renterOrders = await getUserRenterOrders();

  const orders = {
    owner: ownerOrders,
    renter: renterOrders,
  };

  return (
    <>
      <section className="pt-10 pb-14 bg-lightgreen">
        <div className="flex w-10/12 mx-auto items-center justify-between">
          <h1 className="text-text font-semibold text-4xl">
            <span>Ordre og</span>
            <br />
            <span>opslag</span>
          </h1>
          <ProfilePicture />
        </div>
      </section>
      <section className="bg-graybg pt-10 rounded-t-3xl -mt-4">
        <div className="w-11/12 mx-auto flex flex-col gap-2">
          <h2 className="font-bold">Tjek dine:</h2>
          <FilterSquare products={products} posts={posts} orders={orders} />
        </div>
      </section>
    </>
  );
}
