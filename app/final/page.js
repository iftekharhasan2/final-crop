"use client";
import React, { useState, useEffect } from "react";
import InstructionViewer from "../components/InstructionViewer";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import WeatherDetails from "../components/WeatherDetails"; // ✅ Updated WeatherDetails with input

const Final = () => {
  const [userId, setUserId] = useState("");
  const [phase, setPhase] = useState("জমি প্রস্তুতকালীন সময়কাল");
  const [day, setDay] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwt.decode(token);
      if (decoded?.email) {
        setUserId(decoded.email);
      } else {
        throw new Error("Invalid token");
      }
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleBack = () => {
    setSubmitted(false);
    setUserId("");
    setDay(1);
    setPhase("জমি প্রস্তুতকালীন সময়কাল");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow-md font-sans">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
        📘 Farming Instructions Portal
      </h1>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <label htmlFor="phase" className="block mb-2 font-semibold text-gray-700">
              Phase:
            </label>
            <select
              id="phase"
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              <option value="জমি প্রস্তুতকালীন সময়কাল">জমি প্রস্তুতকালীন সময়কাল</option>
              <option value="সংবেদনশীল সময়কাল">সংবেদনশীল সময়কাল</option>
            </select>
          </div>

          <div className="mb-8">
            <label htmlFor="day" className="block mb-2 font-semibold text-gray-700">
              Day:
            </label>
            <input
              id="day"
              type="number"
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              min="1"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition"
          >
            🔍 View Instructions
          </button>
        </form>
      ) : (
        <>
          <InstructionViewer userId={userId} phase={phase} day={day} />
          <WeatherDetails />
          <button
            onClick={handleBack}
            className="mt-8 mx-auto block bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-md transition"
          >
            🔙 Back
          </button>
        </>
      )}
    </div>
  );
};

export default Final;
