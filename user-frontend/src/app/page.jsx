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
