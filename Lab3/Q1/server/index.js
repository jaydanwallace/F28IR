import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors(), express.json());

app.post("/ask", async (req, res) => {
  const start = Date.now();
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: req.body.question }] }] }),
    }
  );
  const data = await r.json();
  res.json({
    answer: data?.candidates?.[0]?.content?.parts?.[0]?.text ?? data?.error?.message ?? "No answer",
    elapsed: (Date.now() - start) / 1000,
  });
});

app.listen(3001);