export async function saveLearning(data) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/save/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function getMyLearnings() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/save/my`, {

    credentials: "include"
  });

  return res.json();
}
