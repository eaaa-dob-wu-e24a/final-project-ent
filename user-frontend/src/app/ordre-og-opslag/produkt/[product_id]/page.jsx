import { getSpecificProduct } from "@/actions/products.actions";
import Image from "next/image";

export default async function Page({ params }) {
  // Get product_id from params
  const { product_id } = await params;

  // Fetch specific product using product_id
  const product = await getSpecificProduct(product_id);

  return (
    <div className="p-4">
      <h1 className="text-text font-bold text-4xl">{product.name}</h1>
      <p>Tilstand: {product.product_condition}</p>
      <p>Størrelse: {product.size}</p>
      <p>Brand: {product.brand}</p>
      <p>Farve: {product.color}</p>
      <p>Produkt type: {product.product_type}</p>
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}/api/product/create/${product.picture_path}`}
        alt={product.name}
        width={100}
        height={100}
      />
    </div>
  );
}
