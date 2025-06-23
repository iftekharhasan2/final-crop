"use client";

import { useState } from "react";

export default function DiseaseDetector() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image file.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5001/api/detect", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || "Unknown error");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Tomato Disease Detector</h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <button type="submit" style={{ marginTop: "10px", padding: "8px 12px" }}>
          {loading ? "Detecting..." : "Detect Disease"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 10 }}>Error: {error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Prediction Result</h2>
          <p><strong>Disease:</strong> {result.prediction}</p>
          <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
          <h3>Prevention Measures:</h3>
          <ul>
            {result.prevention_measures.map((measure, idx) => (
              <li key={idx}>{measure}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
