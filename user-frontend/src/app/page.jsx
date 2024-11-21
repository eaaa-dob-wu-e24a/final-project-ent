import Navigation from "../components/navigation";
import ProductList from "../components/card";
import LoginForm from "../components/login-form";
import ProductForm from "@/components/product-form";

export default function Home() {
  return (
    <>
      <ProductList />
      <ProductForm />
      <Navigation />

      <LoginForm />
    </>
  );
}
