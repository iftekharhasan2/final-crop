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
        fetchCoins(); // refresh after update
      } else {
        alert("Failed to update coins.");
      }
    } catch (err) {
      console.error("Coin update error:", err);
    }
  };

  // Fetch coins when user ID is available
  useEffect(() => {
    if (userId) fetchCoins();
  }, [userId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 font-sans px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Shop</h1>

      {coins !== null ? (
        <p className="text-lg font-medium text-gray-700 mb-6">
          💰 <span className="font-bold text-indigo-600">{coins}</span> Coins Available
        </p>
      ) : (
        <p className="text-gray-500 mb-6">Loading coins...</p>
      )}

      <div className="flex flex-col items-center gap-6 w-full max-w-xl">
        {/* Buy Coins Card */}
        <div className="w-full p-6 sm:p-8 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-center">
          <div className="text-white text-xl font-semibold mb-4 sm:mb-0">
            💰 Price: <span className="font-bold">10 TAKA</span>
          </div>
          <button
            onClick={() => updateCoins(100)}
            className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full shadow-md hover:scale-105 hover:bg-green-100 transition-all duration-300"
          >
            ➕ Buy 100 Coins
          </button>
        </div>

        {/* Remove Coins Card */}
        <div className="w-full p-6 sm:p-8 bg-gradient-to-r from-red-400 to-red-500 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-center">
          <div className="text-white text-xl font-semibold mb-4 sm:mb-0">
            Buy premium package
          </div>
          <button
            onClick={() => updateCoins(-1000)}
            className="bg-white text-red-600 font-semibold px-6 py-3 rounded-full shadow-md hover:scale-105 hover:bg-red-100 transition-all duration-300"
          >
            ➖ Remove 1000 Coins
          </button>
        </div>
      </div>
    </div>
  );
}
