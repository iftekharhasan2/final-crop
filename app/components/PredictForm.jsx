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

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Prediction failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Cucumber Variety Predictor</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <label className="block font-medium mb-1">{key}</label>
            <input
              type={key === "Area" ? "number" : "text"}
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Predict
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
          <h3 className="font-semibold">Prediction:</h3>
          <p>
            <strong>Code:</strong> {result.prediction_code}
          </p>
          <p>
            <strong>Recommendation:</strong> {result.prediction_text}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
