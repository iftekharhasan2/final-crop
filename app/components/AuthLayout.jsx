"use client";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function AuthLayout({ children }) {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setShowNavbar(!!token); // Show navbar only if token exists
  }, []);

  return (
    <>
      {showNavbar && <Navbar />} {/* ✅ render it conditionally */}
      <main className="">{children}</main>
    </>
  );
}
