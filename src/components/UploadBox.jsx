import { useRef, useState } from "react";

export default function UploadBox({ onResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [present,setpresent]=useState(true);
  const handleUpload = async () => {
    if(!file) return( setpresent(false));

    const formData = new FormData();
    formData.append("codebase", file);

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {

        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const tree = await res.json();
      onResult(tree);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card">
      {/* ICON */}
      <div style={{ marginBottom: 12 }}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 5 17 10" />
          <line x1="12" y1="5" x2="12" y2="15" />
        </svg>
      </div>

      <h1>Upload a Repository</h1>

      <p>
        Understand any codebase faster.
        <br />
        Drop a repo → Click a file → Ask why it exists
      </p>

      {/* HIDDEN INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files[0])}
      />

      {/* CUSTOM FILE PICKER */}
      <div
        onClick={() => fileInputRef.current.click()}
        style={{
          marginTop: 20,
          marginBottom: 8,
          padding: "16px 12px",
          border: "2px dashed #d1d5db",
          borderRadius: 10,
          cursor: "pointer",
          background: "#f9fafb",
          textAlign: "center",
          fontWeight: 500,
          color: "#374151"
        }}
      >
        {file ? file.name : "Click to select a ZIP file"}
      </div>

      <p style={{ fontSize: 13, color: "#6b7280" }}>
        Upload a ZIP of your repository (max 200 MB)
      </p>
      <p style={{color:"red",marginBottom:0,fontSize:13}}>
        {!present?"Please select a file":""}
        </p>
      <button
        className="primary-btn"
        style={{
          border: "2px solid gray",
          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          marginTop: 16
        }}
        onClick={handleUpload}
        disabled={loading}
      >

        {loading ? "Uploading..." : "Upload & Explore"}
      </button>
    </div>
  );
}
