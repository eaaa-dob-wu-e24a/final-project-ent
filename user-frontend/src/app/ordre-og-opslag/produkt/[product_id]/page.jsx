import {
  getSpecificProduct,
  updateProduct,
  deleteProduct,
} from "@/actions/products.actions";
import Image from "next/image";
import Link from "next/link";
import UpdateProduct from "../../components/update-product";
import { IoIosArrowBack } from "react-icons/io";

export default async function Page({ params }) {
  // Get product_id from params
  const { product_id } = await params;

  // Fetch specific product using product_id
  const product = await getSpecificProduct(product_id);

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
            {product.name}
          </h1>
        </div>
        <div className="w-10/12 mx-auto">
          <div className="w-full shadow-md rounded-lg">
            <Image
              className="rounded-lg w-full h-60 object-cover"
              src={`${process.env.NEXT_PUBLIC_API_URL}/api/product/create/${product.pictures[0]}`}
              alt={product.name}
              width={100}
              height={100}
            />
          </div>
        </div>
      </section>
      <section className="w-10/12 mx-auto flex flex-col gap-4">
        <UpdateProduct
          product={product}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
        />
      </section>
    </div>
  );
}
