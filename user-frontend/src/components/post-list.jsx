// src/components/PostList.jsx

"use client";

import { useEffect, useState } from "react";
import { getPosts } from "../actions/post.actions";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (posts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.post_id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{post.product.name}</h3>
            <p className="mb-2">{post.description}</p>
            <p className="mb-2">
              <strong>Price per day:</strong> ${post.price_per_day}
            </p>
            <div>
              <strong>Product Details:</strong>
              <ul className="list-disc list-inside">
                <li>Type: {post.product.product_type}</li>
                <li>Size: {post.product.size}</li>
                <li>Color: {post.product.color}</li>
                <li>Condition: {post.product.product_condition}</li>
                <li>Brand: {post.product.brand}</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;
