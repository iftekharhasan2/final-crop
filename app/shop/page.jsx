"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";


export default function Shop() {
  const [userId, setUserId] = useState(null);
  const [coins, setCoins] = useState(null);
  const router = useRouter();

  // Decode user ID from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const decoded = jwt.decode(token);
      if (!decoded?.id) throw new Error("Invalid token");
      setUserId(decoded.id);
    } catch (err) {
      console.error("Token error:", err);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  // Fetch coin balance
  const fetchCoins = async () => {
    try {
      const res = await fetch(`/api/user/${userId}`);
      const data = await res.json();
      setCoins(data.coins);
    } catch (err) {
      console.error("Coin fetch error:", err);
    }
  };

  // Update coin balance
  const updateCoins = async (amount) => {
    if (amount < 0 && coins + amount < 0) {
      alert("You don't have sufficient coins.");
      return;
    }

    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta: amount }),
      });

      if (res.ok) {
        fetchCoins(); // Update coin balance after change
      } else {
        alert("Failed to update coins.");
      }
    } catch (err) {
      console.error("Coin update error:", err);
    }
  };

  // Fetch coins after user ID is set
  useEffect(() => {
    if (userId) fetchCoins();
  }, [userId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 font-sans">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Shop</h1>

      {coins !== null ? (
        <p className="text-lg font-medium text-gray-700 mb-4">
          💰 <span className="font-bold text-indigo-600">{coins}</span> Coins Available
        </p>
      ) : (
        <p className="text-gray-500 mb-4">Loading coins...</p>
      )}

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => updateCoins(100)}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl shadow transition duration-200"
        >
          ➕ Add 100 Coins
        </button>
        <button
          onClick={() => updateCoins(-100)}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow transition duration-200"
        >
          ➖ Remove 100 Coins
        </button>
      </div>


      

     
    </div>
  );
}
