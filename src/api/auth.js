const API_URL = import.meta.env.VITE_API_URL;

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/auth/me`, {
    credentials: "include"
  });
  return res.json();
}

export function loginWithGoogle() {
  window.location.href = `${API_URL}/auth/google`;
}

export function logout() {
  window.location.href = `${API_URL}/auth/logout`;
}
