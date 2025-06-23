"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import LogoutButton from "../components/LogoutButton";

export default function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [coins, setCoins] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const decoded = jwt.decode(token);
      setUserId(decoded.id);
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchCoins = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        const data = await res.json();
        setCoins(data.coins);
      } catch (error) {
        console.error("Failed to fetch coins", error);
      }
    };

    fetchCoins();
  }, [userId]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Dashboard</h1>
      {userId ? <p>Logged in as user ID: {userId}</p> : <p>Loading user...</p>}
      {coins !== null ? <p>Your Coins: {coins}</p> : <p>Loading coins...</p>}
      <LogoutButton />
    </div>
  );
}
