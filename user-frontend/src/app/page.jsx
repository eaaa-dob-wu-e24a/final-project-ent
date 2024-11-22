import Navigation from "../components/navigation";
import ProductList from "../components/card";
import LoginForm from "../components/login-form";
import TopUi from "../components/top-section";
export default function Home() {
  return (
    <>
      <TopUi />
      <ProductList />
      <Navigation />
      <LoginForm />
    </>
  );
}
