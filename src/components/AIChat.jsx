import { useState } from "react";

export default function AIChat({ code, explanation, onAppendExplanation }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastQuestion, setLastQuestion] = useState("");

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const question = input;
    setLastQuestion(question);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          explanation,
          question
        })
      });

      const data = await res.json();

      // ✅ Append directly to explanation
      onAppendExplanation(`

---

### ❓ Question
${question}

### 🤖 Answer
${data.answer}
`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h4 style={{ fontWeight: 600, marginBottom: 12 }}>
        💬 Ask about this code
      </h4>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask a follow-up question..."
          disabled={loading}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 6,
            border: "1px solid #e5e7eb"
          }}
        />
        <button
          className="primary-btn"
          onClick={sendMessage}
          disabled={loading}
        >
          Ask
        </button>
      </div>

      {/* CHATGPT-LIKE FEEDBACK */}
      {loading && (
        <div style={{ marginTop: 12, opacity: 0.8 }}>
          <strong>You:</strong> {lastQuestion}
          <div style={{ marginTop: 4 }}>
            <strong>AI:</strong> Thinking… 🤔
          </div>
        </div>
      )}
    </div>
  );
}
