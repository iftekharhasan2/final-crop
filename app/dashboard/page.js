"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";


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
  }, [router]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      {/* Pass coins to Navbar */}

      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to your Dashboard</h1>

          {userId ? (
            <p className="text-sm text-gray-500">
              Logged in as <span className="font-semibold">{userId}</span>
            </p>
          ) : (
            <p className="text-sm text-gray-400">Loading user...</p>
          )}
        </div>
      </div>
    </div>
  );
}
