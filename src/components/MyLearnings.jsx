import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function MyLearnings() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/save/my`, {
  credentials: "include"
})

      .then(res => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setItems([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading saved learnings...</p>;
  }

  if (items.length === 0) {
    return <p>No saved learnings found.</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 40,              // ✅ better spacing
        height: "100%",
        alignItems: "flex-start",
        overflow:"hidden"
      }}
    >
      {/* LEFT LIST */}
      <div style={{ width: 400,height:"100vh",overflowY:"auto" }}>
        <h3 style={{ marginBottom: 16 }}>My Learnings</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map(item => {
            const normalizedPath = item.filePath.replace(/\\/g, "/");
const parts = normalizedPath.split("/");
const fileName = parts[parts.length - 1];
const project = parts[parts.length - 2];

            return (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  cursor: "pointer",
                  background:
                    selected?.id === item.id ? "#e0ecff" : "#ffffff",
                  border: "1px solid #e5e7eb",
                  boxShadow:
                    selected?.id === item.id
                      ? "0 4px 12px rgba(37,99,235,0.2)"
                      : "none"
                }}
              >
                <div style={{ fontWeight: 600 }}>📑    {fileName}</div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    marginTop: 2
                  }}
                >
                  
                  <div style={{ fontWeight: 600 }}>📁   {project}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT DETAILS */}
      <div style={{ flex: 1, maxWidth: 820,height:"100vh",overflowY:"auto"}}>
        {!selected && (
          <div className="code-placeholder">
            Select a saved learning to view details
          </div>
        )}

        {selected && (
          <>
            {/* HEADER */}
            <h3 style={{ marginBottom: 10 }}>
  📑{selected.filePath.replace(/\\/g, "/").split("/").pop()}
</h3>


            {/* CODE BLOCK */}
            {selected.code && (
              <div
                className="code-block"
                style={{
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 20,
                  maxHeight: 240,
                  overflow: "auto"
                }}
              >
                <pre style={{ margin: 0 }}>
                  <code>{selected.code}</code>
                </pre>
              </div>
            )}

            {/* EXPLANATION */}
            <div
              className="explanation-box"
              style={{
                maxHeight: 300,
                overflow: "auto"
              }}
            >
              <ReactMarkdown>
                {selected.explanation}
              </ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyLearnings;
