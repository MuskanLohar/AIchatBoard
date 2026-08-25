import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

dotenv.config();

const app = express();

// ================= CORS =================

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// ================= MIDDLEWARE =================

app.use(express.json());

// ================= GEMINI =================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ================= HOME ROUTE =================

app.get("/", (req, res) => {
  res.send("GenAI Backend is running");
});

// ================= AI CHAT ROUTE =================

app.post("/api/ask-ai", async (req, res) => {
  try {
    const { prompt, history = [] } = req.body;

    // Validation
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    // ================= CHAT HISTORY =================

    let conversation = "";

    history.forEach((message) => {
      if (message.role === "user") {
        conversation += `User: ${message.text}\n`;
      }

      if (message.role === "ai") {
        conversation += `AI: ${message.text}\n`;
      }
    });

    // ================= FINAL PROMPT =================

    const finalPrompt = `
You are a helpful AI assistant.

Answer the user's question in simple English.

Here is the previous conversation:

${conversation}

Current user question:

${prompt}

Answer the current question using the previous conversation as context when needed.
`;

    // ================= GEMINI API =================

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: finalPrompt,
    });

    // ================= SUCCESS RESPONSE =================

    res.json({
      success: true,
      answer: response.text,
    });
  } catch (error) {
    console.error("GEMINI ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while talking to AI",
    });
  }
});

// ================= SERVER =================

app.listen(5000, () => {
  console.log("Server running on port 5000");
});