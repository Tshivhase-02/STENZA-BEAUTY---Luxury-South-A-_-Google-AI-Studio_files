import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Multi-turn Gemini Beauty Concierge with Google Maps Grounding
app.post('/api/concierge/chat', async (req, res) => {
  try {
    const { messages, userLocation } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'API_KEY_NOT_CONFIGURED',
        message: 'Please set your GEMINI_API_KEY in the Settings > Secrets panel to enable the live Gemini Concierge.',
      });
    }

    // Default to Rosebank, Johannesburg if user location not provided
    const latitude = userLocation?.latitude || -26.1467;
    const longitude = userLocation?.longitude || 28.0436;

    const systemInstruction = `You are the STENZA Mzansi Beauty Concierge, an elite South African luxury beauty advisor and concierge assistant.
Your mission:
1. Help clients discover and book verified hair trichologists, master nail artists, clinical skincare doctors, spa sanctuaries, and barbers in Johannesburg (Sandton, Rosebank, Hyde Park), Cape Town (Camps Bay, V&A Waterfront), Durban (Umhlanga), and Pretoria (Menlyn).
2. Answer questions about loyalty points: STENZA clients earn 1 Loyalty Point for every R10 spent on completed bookings (e.g., R1,200 Hydra-Facial = 120 points). Points can be redeemed as booking credits (1 point = R1 discount).
3. Use the Google Maps tool to ground your answers with accurate real-world beauty salons, studios, landmarks, and addresses across South Africa.
4. Keep your tone sophisticated, welcoming, warm (Mzansi flair with phrases like "Welcome to STENZA", "elevated beauty"), and helpful.
5. All currency is in South African Rand (ZAR, formatted as R150, R650, etc.).
6. Highlight that all bookings are held safely in South African POPIA-compliant trust escrow until treatments are completed.`;

    // Format conversation history for Gemini generateContent
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude,
              longitude,
            },
          },
        },
      },
    });

    const replyText = response.text || 'I am delighted to assist you with your STENZA beauty routine. How else may I assist you today?';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return res.json({
      text: replyText,
      groundingChunks,
    });
  } catch (error: any) {
    console.error('Concierge API error:', error);
    return res.status(500).json({
      error: 'GENAI_ERROR',
      message: error?.message || 'Error processing request with Gemini.',
    });
  }
});

// Mount Vite or serve static files
async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`STENZA full-stack server running on port ${PORT}`);
  });
}

start();
