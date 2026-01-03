import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, []);

  return <p>Signing you in...</p>;
}
