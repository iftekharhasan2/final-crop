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
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Cucumber Crop Manual</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <label>
          Day:
          <input
            type="number"
            name="day"
            min={1}
            max={30}
            value={form.day}
            onChange={handleChange}
            required
            style={{ marginLeft: 8 }}
          />
        </label>
        <br />
        <label>
          City:
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            style={{ marginLeft: 8 }}
          />
        </label>
        <br />
        <label>
          Phase:
          <select name="phase" value={form.phase} onChange={handleChange} style={{ marginLeft: 8 }}>
            <option value="জমি প্রস্তুতকালীন সময়কাল">জমি প্রস্তুতকালীন সময়কাল</option>
            <option value="সংবেদনশীল সময়কাল">সংবেদনশীল সময়কাল</option>
          </select>
        </label>
        <br />
        <label>
          Chara (Seedling) Ready:
          <select name="chara" value={form.chara} onChange={handleChange} style={{ marginLeft: 8 }}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </label>
        <br />
        <label>
          Dynamic Choice:
          <select name="dynamic_choice" value={form.dynamic_choice} onChange={handleChange} style={{ marginLeft: 8 }}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <br />
        <button type="submit" disabled={loading} style={{ marginTop: 12, padding: "6px 12px" }}>
          {loading ? "Loading..." : "Get Crop Manual"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {result && result.message && <p>{result.message}</p>}

      {result && result.data && (
        <>
          <h2>Crop Manual Steps</h2>
          <table
            style={{ borderCollapse: "collapse", width: "100%", marginBottom: 20 }}
            border="1"
          >
            <thead style={{ backgroundColor: "#f2f2f2" }}>
              <tr>
                <th>Step</th>
                <th>Description</th>
                <th>Time of Day</th>
                <th>Time Range</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((step) => (
                <tr key={step.Step}>
                  <td>{step.Step}</td>
                  <td>{step["Task Description"]}</td>
                  <td>{step["Time of Day"]}</td>
                  <td>{step["Time Range"]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {result.extra_notes && result.extra_notes.length > 0 && (
            <>
              <h3>Extra Notes:</h3>
              {result.extra_notes.map((notesTuple, i) => (
                <div key={i}>
                  {notesTuple.map((note, idx) => (
                    <p key={idx}>{note}</p>
                  ))}
                </div>
              ))}
            </>
          )}

          {result.weather && (
            <>
              <h3>Weather Information</h3>
              <p>Temperature: {result.weather.temperature} °C</p>
              <p>Humidity: {result.weather.humidity} %</p>
              <p>Description: {result.weather.description}</p>
              <p>Wind Speed: {result.weather.wind_speed} m/s</p>
            </>
          )}

          {result.warning && <p style={{ color: "red", fontWeight: "bold" }}>{result.warning}</p>}
        </>
      )}
    </div>
  );
}
