import Navigation from "../components/navigation";
import ProductList from "../components/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FD]">
      {/* Main content */}
      <main className="flex-grow flex flex-col gap-8 pt-10 items-center sm:items-start">
        <ProductList />
      </main>

      <Navigation />
    </div>
  );
}
