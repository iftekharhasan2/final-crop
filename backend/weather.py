import requests
from flask_cors import CORS
from datetime import date
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)




def weather_report(city):
    api_key = "1bd0be556664fb2dcaa474e56927746d"
    base_url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    try:
        response = requests.get(base_url)
        response.raise_for_status()
        data = response.json()
        return (
            data["main"]["temp"],
            data["main"]["humidity"],
            data["weather"][0]["main"],
            data["wind"]["speed"]
        )
    except requests.RequestException:
        return None, None, "Unknown", None

@app.route("/api/weather", methods=["POST"])
def api_weather():
    data = request.get_json()
    city = data.get("city", "Dhaka")
    temp, humidity, weather_desc, wind_speed = weather_report(city)
    if temp is None:
        return jsonify({"error": "Could not fetch weather. Check your city name."}), 400
    return jsonify({
        "Temperature": temp,
        "Humidity": humidity,
        "Weather": weather_desc,
        "Wind Speed": wind_speed
    }), 200
    
    
    
if __name__ == '__main__':
    app.run(port=5001)