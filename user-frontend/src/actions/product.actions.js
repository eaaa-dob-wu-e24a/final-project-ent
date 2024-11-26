export async function createProduct(data) {
  const { name, brand, product_type, size, color, product_condition, image } =
    data;

  try {
    const formData = new FormData();

    // Append text fields
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("product_type", product_type);
    formData.append("size", size);
    formData.append("color", color);
    formData.append("product_condition", product_condition);

    // Append the image file
    formData.append("image", image);

    // Send the request
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/product/create/",
      {
        method: "POST",
        credentials: "include",
        body: formData, // Send FormData
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create product");
    }

    return result;
  } catch (error) {
    throw new Error(error.message || "Failed to create product");
  }
}
