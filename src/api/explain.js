export async function explainCode(code) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/explain`, {

    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ code })
  });

  if (!res.ok) {
    throw new Error("Failed to get explanation");
  }

  return res.json();
}
