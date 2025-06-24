"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

export default function DiseaseDetector() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      jwt.decode(token);
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    setError("");
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
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
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white rounded-xl shadow-md font-sans">
      <h1 className="text-2xl font-bold mb-6 text-center text-green-700">
        Tomato Disease Detector
      </h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col items-center space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-green-100 file:text-green-700
            hover:file:bg-green-200
          "
        />

        {preview && (
          <img
            src={preview}
            alt="Selected"
            className="w-full max-h-72 object-contain rounded-lg border border-gray-200"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200 disabled:opacity-50"
        >
          {loading ? "Detecting..." : "Detect Disease"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-center text-red-600 font-medium">{error}</p>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-300 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2 text-green-800">Prediction Result</h2>
          <p>
            <strong>Disease:</strong> <span className="text-green-900">{result.prediction}</span>
          </p>
          <p>
            <strong>Confidence:</strong>{" "}
            <span className="text-green-900">{(result.confidence * 100).toFixed(2)}%</span>
          </p>
          <h3 className="mt-3 font-semibold text-green-800">Prevention Measures:</h3>
          <ul className="list-disc list-inside text-green-700">
            {result.prevention_measures.map((measure, idx) => (
              <li key={idx}>{measure}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
