"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

export default function Shop() {
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

  const fetchCoins = async () => {
    const res = await fetch(`/api/user/${userId}`);
    const data = await res.json();
    setCoins(data.coins);
  };

  const updateCoins = async (amount) => {
    const res = await fetch(`/api/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta: amount }),
    });
    const data = await res.json();
    setCoins(data.coins);
  };

  useEffect(() => {
    if (userId) fetchCoins();
  }, [userId]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Shop Page</h1>
      {coins !== null ? <p>Your Coins: {coins}</p> : <p>Loading...</p>}
      <button onClick={() => updateCoins(100)} style={{ marginRight: 10 }}>Add 100 Coins</button>
      <button onClick={() => updateCoins(-100)}>Remove 100 Coins</button>
    </div>
  );
}
