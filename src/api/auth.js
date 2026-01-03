const API_URL = import.meta.env.VITE_API_URL;

export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!res.ok) return null;
  return res.json();
}


export function loginWithGoogle() {
  window.location.href = `${API_URL}/auth/google`;
}

export function logout() {
  localStorage.removeItem("token"); 
  window.location.href = `${API_URL}/auth/logout`;
}
