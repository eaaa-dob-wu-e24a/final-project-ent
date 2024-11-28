export async function createProduct(data) {
  const { description, price_per_day, product_id } = data;

  try {
    const formData = new FormData();

    formData.append("description", description);
    formData.append("price_per_day", price_per_day);
    formData.append("product_id", product_id);

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/post/create/",
      {
        method: "POST",
        credentials: "include",
        body: formData,
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
