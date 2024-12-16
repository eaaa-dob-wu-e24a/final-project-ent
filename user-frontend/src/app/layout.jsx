import Toast from "@/components/toast";
import "./globals.css";
import NavWrapper from "@/components/nav-wrapper";

export const metadata = {
  title: "Lendr",
  description: "Lendr is a platform for borrowing and lending items",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toast />
        <main className="flex flex-col min-h-screen pb-48 bg-[#F7F9FD]">
          {children}
        </main>
        <NavWrapper />
      </body>
    </html>
  );
}
