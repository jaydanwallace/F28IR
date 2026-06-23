import { useState, useRef, useEffect } from "react";
import { useTimer } from "./useTimer";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { total, addTime, reset } = useTimer();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    const res = await fetch("http://localhost:3001/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    addTime(data.elapsed);
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: data.answer, elapsed: data.elapsed },
    ]);
    setLoading(false);
  }

  return (
    <div style={styles.shell}>
      <div style={styles.header}>
        <h2 style={styles.title}>Gemini Chatbot</h2>
        <div style={styles.timer}>
          ⏱ Total response time: <strong>{total.toFixed(2)}s</strong>
        </div>
      </div>

      <div style={styles.messages}>
        {messages.map((m, i) => (
          <div key={i} style={m.role === "user" ? styles.userMsg : styles.botMsg}>
            <b>{m.role === "user" ? "You" : "Gemini"}:</b> {m.text}
            {m.elapsed !== undefined && (
              <span style={styles.elapsed}> ({m.elapsed.toFixed(2)}s)</span>
            )}
          </div>
        ))}
        {loading && <div style={styles.botMsg}><i>Gemini is thinking…</i></div>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={styles.form}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something…"
          disabled={loading}
        />
        <button style={styles.btn} type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
        <button style={styles.btn} type="button" onClick={() => { setMessages([]); reset(); }}>
          Clear
        </button>
      </form>
    </div>
  );
}

const styles = {
  shell: { maxWidth: 680, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ccc", paddingBottom: 12, marginBottom: 16 },
  title: { margin: 0 },
  timer: { background: "#f0f0f0", padding: "6px 12px", borderRadius: 6, fontSize: 14 },
  messages: { minHeight: 300, maxHeight: 500, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 },
  userMsg: { alignSelf: "flex-end", background: "#dbeafe", padding: "8px 12px", borderRadius: 8, maxWidth: "80%" },
  botMsg: { alignSelf: "flex-start", background: "#f3f4f6", padding: "8px 12px", borderRadius: 8, maxWidth: "80%", whiteSpace: "pre-wrap" },
  elapsed: { color: "#888", fontSize: 12 },
  form: { display: "flex", gap: 8 },
  input: { flex: 1, padding: "8px 12px", fontSize: 15, borderRadius: 6, border: "1px solid #ccc" },
  btn: { padding: "8px 16px", fontSize: 15, borderRadius: 6, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer" },
};
