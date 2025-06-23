"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

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
        // Optionally clear form
        setForm({
          name: "",
          email: "",
          number: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: "300px", margin: "100px auto" }}>
      <h2>Sign Up</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        type="tel"
        placeholder="Phone Number"
        value={form.number}
        onChange={(e) => setForm({ ...form, number: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Retype Password"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
