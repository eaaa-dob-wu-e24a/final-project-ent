import React from "react";
import { getSpecificNonUserPost } from "@/actions/posts.actions";
import PostDetails from "../components/post-details";

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getSpecificNonUserPost(id);

  // Mapping for color labels
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

  return <PostDetails post={post} colorLabels={colorLabels} />;
}
