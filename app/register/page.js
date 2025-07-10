"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ Import router

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter(); // ✅ Use Next.js router

  async function handleRegister(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          number: form.number,
          password: form.password,
        }),
      });

      const data = await res.json();
      alert(data.message || data.error);

      if (res.ok) {
        // ✅ Redirect to login page on successful registration
        router.push("/login");
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-5 border border-green-200"
      >
        <h2 className="text-3xl font-bold text-center text-green-700">Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value })}
          required
          className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          placeholder="Retype Password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          required
          className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white rounded-md transition duration-200 ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="mt-4 flex justify-between text-green-700 font-medium">
          <Link href="/" className="hover:underline transition">
            &larr; Home
          </Link>
          <Link href="/login" className="hover:underline transition">
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
}
