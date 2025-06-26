"use client";

import { useState } from "react";

export default function PredictForm() {
  const [formData, setFormData] = useState({
    Zilla: "Shariatpur",
    Upazila: "Naria",
    "Union Parishad": "Gharisar",
    "Soil Type": "Loam",
    Season: "Rabi",
    Irrigation: "Good",
    Drainage: "Medium",
    "Insect infestation": "Medium",
    Diseases: "Low",
    "Last Season Crop": "Rice",
    Area: 2,
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSaved(false);

    try {
      const res = await fetch("http://localhost:5002/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Flask backend error response:", text);
        try {
          const err = JSON.parse(text);
          throw new Error(err.error || "Prediction failed");
        } catch {
          throw new Error("Prediction failed and response is not JSON");
        }
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-lg font-sans">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-green-800 tracking-wide">
        Cucumber Variety Predictor
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label
              htmlFor={key}
              className="mb-1 font-semibold text-green-700 tracking-wide"
            >
              {key}
            </label>
            <input
              type={key === "Area" ? "number" : "text"}
              name={key}
              id={key}
              value={value}
              onChange={handleChange}
              className="rounded-md border border-green-300 px-4 py-2 
                focus:outline-none focus:ring-2 focus:ring-green-500 
                focus:border-green-600 transition-shadow duration-300
                placeholder-green-300"
              required
              placeholder={`Enter ${key}`}
              min={key === "Area" ? 0 : undefined}
              step={key === "Area" ? 0.01 : undefined}
            />
          </div>
        ))}

        <div className="sm:col-span-2 md:col-span-3 flex justify-center items-center">
          <button
            type="submit"
            className="w-full max-w-xs bg-gradient-to-r from-green-600 to-green-800 
              hover:from-green-800 hover:to-green-600 text-white font-bold 
              py-3 rounded-xl shadow-lg transition-transform duration-300 
              hover:scale-105 active:scale-95"
          >
            Predict
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-8 p-5 bg-green-50 border border-green-400 rounded-xl shadow-inner max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-2 text-green-900 tracking-tight">
            🌱 Prediction Result
          </h3>
          <p className="text-green-800 text-lg leading-relaxed">
            <strong>Recommendation:</strong> {result.prediction_text}
          </p>
        </div>
      )}

      {saved && (
        <div className="mt-6 p-4 bg-blue-100 border border-blue-400 rounded-lg flex items-center space-x-3 shadow-sm max-w-3xl mx-auto">
          <span className="text-blue-600 text-xl">✅</span>
          <span className="text-blue-700 font-medium">
            Prediction saved to database!
          </span>
        </div>
      )}

      {error && (
        <div className="mt-8 p-5 bg-red-100 border border-red-400 rounded-xl flex items-center space-x-3 shadow-sm max-w-3xl mx-auto">
          <span className="text-red-600 text-xl">⚠️</span>
          <span className="text-red-700 font-semibold">{error}</span>
        </div>
      )}
    </div>
  );
}
