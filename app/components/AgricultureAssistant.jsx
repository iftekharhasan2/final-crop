"use client";

import { useState } from "react";

export default function CropManual() {
  const [form, setForm] = useState({
    day: 1,
    city: "Dhaka",
    phase: "জমি প্রস্তুতকালীন সময়কাল",
    chara: "No",
    dynamic_choice: "Yes",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Determine max day limit based on phase
  const maxDay = form.phase === "জমি প্রস্তুতকালীন সময়কাল" ? 3 : 30;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5001/api/crop_manuals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Unknown error");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    let value = e.target.value;

    if (e.target.name === "day") {
      // Clamp day value between 1 and maxDay
      value = Math.min(Math.max(Number(value), 1), maxDay);
    }

    setForm((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        Cucumber Crop Manual
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="flex flex-wrap gap-4">
          <label className="flex flex-col flex-1 min-w-[120px]">
            Day:
            <input
              type="number"
              name="day"
              min={1}
              max={maxDay}
              value={form.day}
              onChange={handleChange}
              required
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </label>

          <label className="flex flex-col flex-1 min-w-[120px]">
            City:
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </label>

          <label className="flex flex-col flex-1 min-w-[180px]">
            Phase:
            <select
              name="phase"
              value={form.phase}
              onChange={handleChange}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="জমি প্রস্তুতকালীন সময়কাল">জমি প্রস্তুতকালীন সময়কাল</option>
              <option value="সংবেদনশীল সময়কাল">সংবেদনশীল সময়কাল</option>
            </select>
          </label>

          {/* Show Chara (Seedling) Ready only if phase is সংবেদনশীল সময়কাল */}
          {form.phase === "সংবেদনশীল সময়কাল" && (
            <label className="flex flex-col flex-1 min-w-[140px]">
              Chara (Seedling) Ready:
              <select
                name="chara"
                value={form.chara}
                onChange={handleChange}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </label>
          )}

          <label className="flex flex-col flex-1 min-w-[140px]">
            Dynamic Choice:
            <select
              name="dynamic_choice"
              value={form.dynamic_choice}
              onChange={handleChange}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-200 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get Crop Manual"}
        </button>
      </form>

      {error && <p className="text-center text-red-600 font-semibold mb-4">{error}</p>}

      {result && result.message && (
        <p className="text-center text-green-700 font-medium mb-4">{result.message}</p>
      )}

      {result && result.data && (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-green-800">Crop Manual Steps</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 border-r border-gray-300 text-left font-semibold">Step</th>
                  <th className="px-4 py-2 border-r border-gray-300 text-left font-semibold">Description</th>
                  <th className="px-4 py-2 border-r border-gray-300 text-left font-semibold">Time of Day</th>
                  <th className="px-4 py-2 text-left font-semibold">Time Range</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((step) => (
                  <tr key={step.Step} className="even:bg-green-50">
                    <td className="px-4 py-2 border-t border-gray-300">{step.Step}</td>
                    <td className="px-4 py-2 border-t border-gray-300">{step["Task Description"]}</td>
                    <td className="px-4 py-2 border-t border-gray-300">{step["Time of Day"]}</td>
                    <td className="px-4 py-2 border-t border-gray-300">{step["Time Range"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {result.extra_notes && result.extra_notes.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mt-6 mb-3 text-green-700">Extra Notes:</h3>
              {result.extra_notes.map((notesTuple, i) => (
                <div key={i} className="mb-4 space-y-1">
                  {notesTuple.map((note, idx) => (
                    <p key={idx} className="text-gray-700">
                      {note}
                    </p>
                  ))}
                </div>
              ))}
            </>
          )}

          {result.weather && (
            <>
              <h3 className="text-xl font-semibold mt-6 mb-3 text-green-700">Weather Information</h3>
              <p>
                Temperature: <span className="font-medium">{result.weather.temperature} °C</span>
              </p>
              <p>
                Humidity: <span className="font-medium">{result.weather.humidity} %</span>
              </p>
              <p>
                Description: <span className="font-medium">{result.weather.description}</span>
              </p>
              <p>
                Wind Speed: <span className="font-medium">{result.weather.wind_speed} m/s</span>
              </p>
            </>
          )}

          {result.warning && (
            <p className="text-red-700 font-bold mt-6 text-center">{result.warning}</p>
          )}
        </>
      )}
    </div>
  );
}
