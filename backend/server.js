import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("GenAI Backend is running");
});

app.post("/api/ask-ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const finalPrompt = `
You are a helpful AI assistant.

Answer the user's question in simple English.

User question:
${prompt}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: finalPrompt,
    });

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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});