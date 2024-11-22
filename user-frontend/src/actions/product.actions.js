
export async function createProduct(data) {

    const { name, brand, product_type, size, color, product_condition } = data;

    try {
        // Make the fecth request to the backend
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/product/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                name,
                brand,
                product_type,
                size,
                color,
                product_condition,
            }),
        });

        // parse the response
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to create product');
        }

        return result;
    } catch (error) {
        throw new Error(error.message || 'Failed to create product');
    }
}