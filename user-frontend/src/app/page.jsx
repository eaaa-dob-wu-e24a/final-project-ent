import Image from "next/image";

import Navigation from "../components/navigation";
import ProductList from "../components/card";
import LoginForm from "../components/login-form";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center bg-[#F7F9FD] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ProductList />
        <Navigation />

        <LoginForm />
      </main>
    </div>
  );
}
