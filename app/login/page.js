"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ emailOrNumber: "", password: "" });

  async function handleLogin(e) {
    e.preventDefault();

    const isEmail = form.emailOrNumber.includes("@");
    const payload = isEmail
      ? { email: form.emailOrNumber, password: form.password }
      : { number: form.emailOrNumber, password: form.password };

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      // Navigate and refresh instantly
      window.location.href = "/dashboard";
    } else {
      alert(data.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium mb-1 block">
            Email or Phone Number
          </span>
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={form.emailOrNumber}
            onChange={(e) =>
              setForm({ ...form, emailOrNumber: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700 font-medium mb-1 block">Password</span>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Login
        </button>

        {/* Home button below login */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            &larr; Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
}
