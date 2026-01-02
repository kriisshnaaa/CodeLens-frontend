import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";        // ✅ REQUIRED (layout + structure)
import "./styles/theme.css"; // ✅ REQUIRED (colors + theme)
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#0f172a",
          color: "#fff",
          borderRadius: "8px",
          padding: "12px 14px"
        }
      }}
    />
  </React.StrictMode>
);
