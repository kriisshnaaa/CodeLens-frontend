export async function readFile(filePath) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/read-file`, {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filePath })
  });

  return res.json();
}
