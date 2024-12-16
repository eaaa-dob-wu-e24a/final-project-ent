export async function createPost(data) {
  const { description, price_per_day, product_id, location } = data;

  try {
    const cookieString = typeof document !== "undefined" ? document.cookie : "";
    const tokenMatch = cookieString
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    const accessToken = tokenMatch ? tokenMatch.split("=")[1] : null;

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/post/create/", // Ensure the endpoint is correct
      {
        method: "POST",
        credentials: "include",
        headers: accessToken
          ? {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
        body: JSON.stringify({
          description,
          price_per_day,
          product_id,
          location,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create post");
    }

    return result;
  } catch (error) {
    throw new Error(error.message || "Failed to create post");
  }
}
// export async function getPosts() {
//   try {
//     const response = await fetch(
//       process.env.NEXT_PUBLIC_API_URL + "/api/post/read/",
//       {
//         method: "GET",
//         credentials: "include",
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.error || "Failed to fetch posts");
//     }

//     return result;
//   } catch (error) {
//     throw new Error(error.message || "Failed to fetch posts");
//   }
//}
