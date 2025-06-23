export async function getCropManuals(data) {
  const formData = new URLSearchParams();
  Object.entries(data).forEach(([key, val]) => formData.append(key, val));

  const response = await fetch("http://localhost:5001/crop_manuals", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const pre = doc.querySelector("pre");

  const steps = [];
  doc.querySelectorAll("li").forEach((li) => {
    const text = li.textContent;
    const stepMatch = text.match(/^(\d+): (.*?) \((.*?)\, (.*?)\)$/);
    if (stepMatch) {
      steps.push({
        Step: stepMatch[1],
        "Task Description": stepMatch[2],
        "Time of Day": stepMatch[3],
        "Time Range": stepMatch[4],
      });
    }
  });

  return { data: steps };
}
