export async function detectDisease(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:5001/detect", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  return result;
}
