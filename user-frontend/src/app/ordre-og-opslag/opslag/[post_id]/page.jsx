import { getSpecificPost, updatePost } from "@/actions/posts.actions";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import UpdatePost from "../../components/update-post";

export default async function Page({ params }) {
  const { post_id } = await params;

  const post = await getSpecificPost(post_id);

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
            {post.product["name"]}
          </h1>
        </div>
        <div className="w-10/12 mx-auto">
          <div className="w-full shadow-md rounded-lg">
            <Image
              className="rounded-lg w-full h-60 object-cover"
              src={`${process.env.NEXT_PUBLIC_API_URL}/api/product/create/${post.product["pictures"][0]}`}
              alt={post.product["name"]}
              width={100}
              height={100}
            />
          </div>
        </div>
      </section>
      <section className="w-10/12 mx-auto flex flex-col gap-4">
        <UpdatePost post={post} updatePost={updatePost} />
      </section>
    </div>
  );
}
