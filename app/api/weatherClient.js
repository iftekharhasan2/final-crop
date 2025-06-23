export async function getWeather({ city }) {
  try {
    const res = await fetch("http://localhost:5001/weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `city=${city}`,
    });

    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const pre = doc.querySelector("pre");

    if (!pre) return null;

    return JSON.parse(pre.textContent);
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}
