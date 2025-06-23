"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ emailOrNumber: "", password: "" });

  async function handleLogin(e) {
    e.preventDefault();

    // Prepare the payload based on whether input looks like email or number
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
      router.push("/dashboard");
    } else {
      alert(data.error || "Login failed");
    }
  }

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: "300px", margin: "100px auto" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email or Phone Number"
        value={form.emailOrNumber}
        onChange={(e) => setForm({ ...form, emailOrNumber: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
