"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function Navbar({ coins, userId }) {
  const pathname = usePathname();
  const isLoggedIn = !!userId;

  const guestLinks = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  const authLinks = [
    { name: "Shop", path: "/shop" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Crop Manual", path: "/crop-manual" },
    { name: "Crop Prediction", path: "/crop-prediction" },
    { name: "Disease Detector", path: "/disease-detector" },
    { name: "Final", path: "/final" },
  ];

  // Show authLinks only if logged in, else guestLinks
  const linksToShow = isLoggedIn ? authLinks : guestLinks;

  // Normalize pathname for active link styling
  const normalizePath = (path) => path.replace(/\/$/, "");

  return (
    <nav className="bg-green-600 text-white p-4 shadow-md flex justify-between items-center">
      <ul className="flex space-x-6">
        {linksToShow.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`hover:underline ${
                normalizePath(pathname) === normalizePath(item.path)
                  ? "font-bold underline"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center space-x-6">
        {isLoggedIn && (
          <p className="text-yellow-300 font-semibold select-none">
            💰 {coins !== null ? coins : "..."}
          </p>
        )}

        {isLoggedIn && <LogoutButton />}
      </div>
    </nav>
  );
}
