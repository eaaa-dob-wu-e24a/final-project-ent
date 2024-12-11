import { Outlet } from "@remix-run/react";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-fit px-3 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold">Admin Panel</div>
        <nav className="flex-grow">
          <ul>
            <li className="px-6 py-2 hover:bg-gray-700">
              <a href="/" className="block">
                Dashboard
              </a>
            </li>
            <li className="px-6 py-2 hover:bg-gray-700">
              <a href="/userspage" className="block">
                Brugere
              </a>
            </li>
            <li className="px-6 py-2 hover:bg-gray-700">
              <a href="/orderpage" className="block">
                Ordre
              </a>
            </li>
            <li className="px-6 py-2 hover:bg-gray-700">
              <a href="/productpage" className="block">
                Produkter
              </a>
            </li>
            <li className="px-6 py-2 hover:bg-gray-700">
              <a href="/postspage" className="block">
                Opslag
              </a>
            </li>
          </ul>
        </nav>
        <div className="p-6">
          <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded">
            Logud
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-grow overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
