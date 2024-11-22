// actions/product.actions.js

export async function createProduct(formData) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/product/create/",
      {
        method: "POST",
        credentials: "include",
        body: formData,
        // Do not set 'Content-Type' header when sending FormData
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create product");
    }

    return {
      success: true,
      message: result.message,
      product_id: result.product_id,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to create product",
    };
  }
}
