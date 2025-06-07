"use client";
import { useState } from "react";
import { generateGeminiResponse } from "../../../configs/AImodel";

export default function GeminiDemo() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");
    try {
      const result = await generateGeminiResponse(input);
      setAnswer(result);
    } catch (err) {
      setAnswer("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24 }}>
      <h1>Gemini Demo</h1>
      <form onSubmit={handleAsk}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Gemini something..."
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />
        <button type="submit" disabled={loading || !input}>
          {loading ? "Loading..." : "Ask"}
        </button>
      </form>
      {answer && (
        <div style={{ marginTop: 24, whiteSpace: "pre-wrap" }}>
          <strong>Gemini says:</strong>
          <div>{answer}</div>
        </div>
      )}
    </div>
  );
}