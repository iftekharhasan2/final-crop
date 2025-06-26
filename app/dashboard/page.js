"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import Database from "../components/Database";
import CostDashboard from "../components/CostDashboard";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center py-16 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-900">Welcome to your Dashboard</h1>

        {userId ? (
          <>
            <p className="text-lg text-gray-700">
              Logged in as <span className="font-semibold text-indigo-600">{userId}</span>
            </p>
            <div className="inline-flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 font-semibold px-4 py-2 rounded-full shadow-md">
              <svg
                className="w-5 h-5 text-indigo-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.5 0-3 1-3 3s1.5 3 3 3 3-1 3-3-1.5-3-3-3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19c-4.418 0-8-3.582-8-8a7.96 7.96 0 0 1 1.879-5.088"
                />
              </svg>
              <span>Coins: {coins !== null ? coins : "Loading..."}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400">Loading user...</p>
        )}
      </div>

      <div className="w-full max-w-5xl mt-16">
        <Database />
      </div>
      <div className="w-full max-w-5xl mt-16 flex items-center justify-between">
        <CostDashboard />
      </div>
    </div>
  );
}
