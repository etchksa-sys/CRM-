import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI lazily
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API endpoint for AI Sales Copilot & Email Generator
app.post("/api/ai/copilot", async (req, res) => {
  try {
    const { prompt, contextType, data, language } = req.body;
    const ai = getAIClient();

    let systemInstruction = language === 'en' 
      ? "You are an expert CRM Sales Assistant and AI Copilot. Provide concise, professional, sales-optimized responses, emails, or deal closing strategies in English."
      : "أنت مساعد ذكي خبير في إدارة علاقات العملاء والمبيعات (CRM AI Copilot). قدم ردوداً احترافية، رسائل متابعة بيعية مقنعة، أو استراتيجيات لإغلاق الصفقات باللغة العربية بدقة وعالية الاحترافية.";

    const fullPrompt = `${systemInstruction}\n\nContext Type: ${contextType || 'general'}\nData context: ${JSON.stringify(data || {})}\nUser Request: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: fullPrompt,
    });

    res.json({ success: true, result: response.text });
  } catch (error: any) {
    console.error("AI Copilot Error:", error);
    // Fallback response if API key is missing or quota exceeded
    const lang = req.body.language || 'ar';
    const fallback = lang === 'en'
      ? "AI Sales Assistant Note: Make sure to follow up with the client within 24 hours, address their key objections regarding pricing or timeline, and offer a personalized demo session to accelerate deal closing."
      : "ملاحظة مساعد المبيعات الذكي: احرص على متابعة العميل خلال 24 ساعة القادمة، والتركيز على تلبية احتياجاتهم وتوضيح القيمة المضافة لزيادة سرعة إغلاق الصفقة بنجاح.";
    res.json({ success: true, result: fallback, isFallback: true });
  }
});

// API Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`CRM Pro Server running on http://localhost:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
