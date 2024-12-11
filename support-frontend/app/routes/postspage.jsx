// app/routes/postspage.jsx
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { fetchPosts } from "../utils/post_util";
import Posts from "../components/posts";

export const loader = async ({ request }) => {
  const posts = await fetchPosts(request);
  return json({ posts });
};

export default function PostsPage() {
  const { posts } = useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) =>
    post.product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      <input
        type="text"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <Posts posts={filteredPosts} layout="grid" />
    </div>
  );
}
