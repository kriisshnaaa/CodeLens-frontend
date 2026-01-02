import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import AIChat from "./AIChat";

export default function CodeViewer({
  file,
  code,
  explanation,
  explaining,
  onExplain,
  onSave,
  onAppendExplanation
}) {
  const [expanded, setExpanded] = useState(false);
  const [saveState, setSaveState] = useState("idle");
// idle | saving | saved
const handleSaveWithFeedback = async () => {
  if (saveState !== "idle") return;

  setSaveState("saving");
  await onSave();
  setSaveState("saved");

  setTimeout(() => {
    setSaveState("idle");
  }, 2000);
};

  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : "auto";
  }, [expanded]);

  useEffect(() => {
    const handler = e => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const displayName = file
    ? file.split("\\").pop().split("/").pop()
    : null;

  if (!file) {
    return (
      <div className="code-viewer">
        <div className="code-placeholder">
          Select a file from the tree to view code
        </div>
      </div>
    );
  }

  return (
    <div
      className="code-viewer"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }}
    >
      {/* ================= STYLES (UNCHANGED) ================= */}
      <style>
        {`
.ai-explanation-content {
  max-width: 760px;
  margin: 0 auto;
  padding-bottom: 48px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 17px;
  line-height: 1.85;
  color: #111827;
}

.ai-explanation-content h1 {
  font-size: 30px;
  font-weight: 800;
  margin-bottom: 20px;
}

.ai-explanation-content h2 {
  font-size: 22px;
  font-weight: 700;
  margin-top: 36px;
  margin-bottom: 12px;
}

.ai-explanation-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin-top: 28px;
  margin-bottom: 10px;
}

.ai-explanation-content p {
  margin-bottom: 20px;
}

.ai-explanation-content ul,
.ai-explanation-content ol {
  padding-left: 26px;
  margin-bottom: 20px;
}

.ai-explanation-content li {
  margin-bottom: 10px;
}

.ai-explanation-content code {
  background: #eef2ff;
  color: #1e3a8a;
  padding: 3px 6px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
}

.ai-explanation-content blockquote {
  border-left: 4px solid #6366f1;
  padding: 14px 18px;
  margin: 28px 0;
  background: #f8fafc;
  border-radius: 6px;
}
`}
      </style>

      {/* ================= FILE BADGE ================= */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          marginBottom: 6,
          borderRadius: 8,
          background: "#f5f7fa",
          border: "1px solid #e0e6ed",
          fontWeight: "bold",
          fontSize: 13,
          width: "fit-content"
        }}
      >
        📄 {displayName?.toUpperCase()}
      </div>

      {/* ================= CODE ================= */}
      <div className="code-viewer-section">
        <h3 style={{ fontWeight: "bold" }}>🔨 Here's Your Code</h3>

        <pre
          className="code-block"
          style={{
            maxHeight: 160,
            overflow: "auto",
            whiteSpace: "pre"
          }}
        >
          {code}
        </pre>

        <button className="primary-btn" onClick={onExplain} disabled={explaining}>
  {explaining ? "✨ Explaining..." : "✨ Explain with AI"}
</button>
{explaining && (
  <p style={{ marginTop: 8, opacity: 0.7 }}>
    AI is analyzing your code… 🤔
  </p>
)}

      </div>

      {/* ================= COLLAPSED EXPLANATION ================= */}
      {explanation && (
        <div
          className="code-viewer-section explanation-box"
          style={{
            flex: 1,
            overflowY: "auto",
            marginTop: 16,
            padding: 16,
            position: "relative"
          }}
        >
          <div style={{position:"fixed"}}>
          <button
            onClick={() => setExpanded(true)}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              border: "1px solid #e0e0e0",
              background: "#fff",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: 25
            }}
          >
            ⤢
          </button>
</div>
          <ReactMarkdown>{explanation}</ReactMarkdown>

          {/* CHAT (COLLAPSED) */}
          <AIChat code={code} explanation={explanation} onAppendExplanation={onAppendExplanation}/>
        </div>
      )}

      {/* ================= SAVE ================= */}
      {explanation && (
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <button
  className="logout-btn"
  onClick={handleSaveWithFeedback}
  disabled={saveState === "saving"}
>
  {saveState === "idle" && "💾 Save Learning"}
  {saveState === "saving" && "⏳ Saving..."}
  {saveState === "saved" && "✅ Saved"}
</button>

        </div>
      )}

      {/* ================= FULLSCREEN ================= */}
      {expanded && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#f9fafb",
            zIndex: 9999,
            padding: 24,
            overflowY: "auto"
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16
            }}
          >
            <h1 style={{ fontSize: 26, fontWeight: 700 ,marginLeft:650,textDecoration:"underline"}}>
              🧠 AI Explanation
            </h1>

            <button
              onClick={() => setExpanded(false)}
              style={{
                border: "none",
                background: "#FDECEC",
                color: "#b91c1c",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              ✕ Close
            </button>
          </div>

          {/* CONTENT */}
          <div className="ai-explanation-content">
            <ReactMarkdown>{explanation}</ReactMarkdown>

            {/* CHAT INSIDE EXPANDED VIEW */}
            <div style={{ marginTop: 48 }}>
              <AIChat code={code} explanation={explanation} onAppendExplanation={onAppendExplanation} />
            </div>
          </div>
           {explanation && (
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <button
  className="logout-btn"
  onClick={handleSaveWithFeedback}
  disabled={saveState === "saving"}
>
  {saveState === "idle" && "💾 Save Learning"}
  {saveState === "saving" && "⏳ Saving..."}
  {saveState === "saved" && "✅ Saved"}
</button>

        </div>
      )}
        </div>
        
      )}
      
    </div>
  );
}
