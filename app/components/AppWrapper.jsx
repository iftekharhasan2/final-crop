// components/AppWrapper.jsx (client component)
"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import jwt from "jsonwebtoken";

export default function AppWrapper({ children }) {
  const pathname = usePathname();
  const [userId, setUserId] = useState(null);
  const [coins, setCoins] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt.decode(token);
        if (decoded?.id) setUserId(decoded.id);
      } catch {
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setCoins(null);
      return;
    }

    async function fetchCoins() {
      try {
        const res = await fetch(`/api/user/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch coins");
        const data = await res.json();
        setCoins(data.coins);
      } catch (e) {
        console.error(e);
        setCoins(null);
      }
    }

    fetchCoins();
  }, [userId]);

  const noNavbarPaths = ["/", "/login", "/register"];
  const showNavbar = !noNavbarPaths.includes(pathname);

  return (
    <>
      {showNavbar && <Navbar coins={coins} userId={userId} />}
      {children}
    </>
  );
}
