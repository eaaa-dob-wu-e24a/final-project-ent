export async function createProduct(data) {
  const { name, product_type, size, color, product_condition, brand, image } =
    data;

  try {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("product_type", product_type);
    formData.append("size", size);
    formData.append("color", color);
    formData.append("product_condition", product_condition);
    formData.append("brand", brand || "");

    // Append the image file to the form data
    formData.append("image", image);

    const cookieString = typeof document !== "undefined" ? document.cookie : "";
    const tokenMatch = cookieString
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    const accessToken = tokenMatch ? tokenMatch.split("=")[1] : null;

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/product/create/",
      {
        method: "POST",
        credentials: "include",
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
        body: formData,
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
