import { useState, useEffect } from "react";

export default function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const colorLabels = {
    "#000000": "Sort",
    "#5337FF": "Blå",
    "#72CA81": "Grøn",
    "#7F8992": "Grå",
    "#9E29BB": "Lilla",
    "#C1C1C1": "Sølv",
    "#FF3DD4": "Pink",
    "#FF5757": "Rød",
    "#FFB23F": "Orange",
    "#FFE34E": "Gul",
    "#FFFFFF": "Hvid",
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const cookieString =
          typeof document !== "undefined" ? document.cookie : "";
        const tokenMatch = cookieString
          .split("; ")
          .find((row) => row.startsWith("access_token="));
        const accessToken = tokenMatch ? tokenMatch.split("=")[1] : null;

        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/post/read/?user_only=false",
          {
            method: "GET",
            credentials: "include",
            headers: accessToken
              ? {
                  Authorization: `Bearer ${accessToken}`,
                }
              : {},
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts.");
        }

        const data = await response.json();

        const transformedPosts = data.map((post) => {
          // Construct the image URL
          const imageUrl =
            post.product.pictures && post.product.pictures.length > 0
              ? `${process.env.NEXT_PUBLIC_API_URL}/api/product/create/${post.product.pictures[0]}`
              : "/dummypicture.webp";

          return {
            id: post.post_id,
            title: post.product.name,
            product_type: post.product.product_type,
            condition: post.product.product_condition,
            size: post.product.size,
            colorLabel: colorLabels[post.product.color] || post.product.color,
            colorCode: post.product.color,
            brand: post.product.brand,
            description: post.description,
            location: post.location,
            price_per_day: post.price_per_day,
            image: imageUrl,
          };
        });

        setPosts(transformedPosts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Der skete en fejl under hentning af opslag.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
}
