"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherDetails = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    // Get user location coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocode coordinates to city name
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            const detectedCity = data.address?.city || data.address?.town || data.address?.village || "Dhaka";
            setCity(detectedCity);
            fetchWeather(detectedCity);
          } catch (err) {
            setGeoError("Could not determine city from your location.");
          }
        },
        (err) => {
          setGeoError("Location permission denied or not available.");
        }
      );
    } else {
      setGeoError("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      const res = await axios.post("https://crop-backend-weather.onrender.com/api/weather", {
        city: cityName,
      });
      setWeather(res.data);
      setLoading(false);
    } catch (err) {
      setWeather(null);
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 p-4 bg-blue-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">🌤️ Weather Details</h2>

      {loading && <p className="text-gray-600">Fetching weather...</p>}
      {geoError && <p className="text-red-600">{geoError}</p>}

      {!loading && weather && (
        <ul className="text-gray-800 space-y-2">
          <li><strong>City:</strong> {city}</li>
          <li><strong>Temperature:</strong> {weather.Temperature} °C</li>
          <li><strong>Humidity:</strong> {weather.Humidity} %</li>
          <li><strong>Description:</strong> {weather.Weather}</li>
          <li><strong>Wind Speed:</strong> {weather["Wind Speed"]} m/s</li>
        </ul>
      )}
    </div>
  );
};

export default WeatherDetails;