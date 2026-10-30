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

// Official STENZA Admin Access Identifiers (Existing credentials unchanged)
const VALID_ADMIN_ACCOUNTS = [
  'STZ-ADMIN-2026',
  'ADMIN@STENZA.CO.ZA',
  'ADMIN2026',
  'STENZA-ADMIN',
  'ADMIN',
  'ZA-COMPLIANCE-8812',
];

// Helper to determine if Admin Demo / Development Mode is active
// Enforces:
// 1. Configurable via ADMIN_DEMO_MODE environment variable
// 2. ONLY enabled in local development (NODE_ENV !== 'production')
// 3. Automatically disabled in production
function getAdminDemoMode(): boolean {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return process.env.ADMIN_DEMO_MODE !== 'false' && process.env.ADMIN_DEMO_MODE !== '0';
}

// Endpoint to inspect admin authentication configuration and mode
app.get('/api/admin/auth-config', (_req, res) => {
  return res.json({
    devMode: getAdminDemoMode(),
    isProduction: process.env.NODE_ENV === 'production',
  });
});

// Admin Authentication endpoint (Backend protected authorization)
app.post('/api/admin/login', (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const cleanUser = (usernameOrEmail || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanUser) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your administrator username or email.',
      });
    }

    if (!cleanPass) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your administrator password.',
      });
    }

    // Do NOT save or log the temporary username or password.
    const isDevMode = getAdminDemoMode();

    if (isDevMode) {
      // Temporary development mode: Allow access using any non-empty username & password.
      // Do not require existing admin credentials while this temporary mode is enabled.
      const normalized = cleanUser.toUpperCase();
      const isKnownAdmin = VALID_ADMIN_ACCOUNTS.includes(normalized);

      return res.json({
        success: true,
        devMode: true,
        officer: {
          name: isKnownAdmin ? 'Govender M.' : 'Development Admin',
          role: isKnownAdmin ? 'Accreditation & Compliance Officer' : 'Temporary Admin (Dev Mode)',
          desk: 'South African Marketplace Governance',
        },
        token: `stz_adm_dev_${Date.now()}`,
      });
    }

    // Production / Standard mode: Check against existing valid admin accounts
    const normalized = cleanUser.toUpperCase();
    const isAuthorized = VALID_ADMIN_ACCOUNTS.includes(normalized);

    if (isAuthorized) {
      return res.json({
        success: true,
        devMode: false,
        officer: {
          name: 'Govender M.',
          role: 'Accreditation & Compliance Officer',
          desk: 'South African Marketplace Governance',
        },
        token: `stz_adm_${Buffer.from(normalized + Date.now()).toString('base64').slice(0, 24)}`,
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Authentication failed. Invalid administrator credentials.',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Authentication service temporarily unavailable.',
    });
  }
});

// Identity Document Verification API (Validates SA ID and Passport)
app.post('/api/verify/identity-document', (req, res) => {
  try {
    const { documentType, documentNumber } = req.body;

    if (!documentType || (documentType !== 'SA_ID' && documentType !== 'PASSPORT')) {
      return res.status(400).json({
        valid: false,
        error: 'Please specify a valid document type (SA_ID or PASSPORT).',
      });
    }

    if (!documentNumber) {
      return res.status(400).json({
        valid: false,
        error: 'Identity document number is required.',
      });
    }

    if (documentType === 'SA_ID') {
      const clean = String(documentNumber).replace(/\s+/g, '');
      if (!/^\d{13}$/.test(clean)) {
        return res.status(400).json({
          valid: false,
          error: 'South African ID must contain exactly 13 numeric digits.',
        });
      }

      const yy = parseInt(clean.slice(0, 2), 10);
      const mm = parseInt(clean.slice(2, 4), 10);
      const dd = parseInt(clean.slice(4, 6), 10);

      if (mm < 1 || mm > 12) {
        return res.status(400).json({
          valid: false,
          error: `Invalid month (${clean.slice(2, 4)}) in South African ID.`,
        });
      }

      const fullYear = yy > 26 ? 1900 + yy : 2000 + yy;
      const isLeap = (fullYear % 4 === 0 && fullYear % 100 !== 0) || fullYear % 400 === 0;
      const daysInMonths = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (dd < 1 || dd > daysInMonths[mm - 1]) {
        return res.status(400).json({
          valid: false,
          error: `Invalid calendar day (${clean.slice(4, 6)}) for month ${mm} in South African ID.`,
        });
      }

      // Luhn Checksum
      let sumA = 0;
      for (let i = 0; i < 11; i += 2) sumA += parseInt(clean[i], 10);
      let evenDigits = '';
      for (let i = 1; i < 12; i += 2) evenDigits += clean[i];
      const doubled = (parseInt(evenDigits, 10) * 2).toString();
      let sumB = 0;
      for (let i = 0; i < doubled.length; i++) sumB += parseInt(doubled[i], 10);
      const total = sumA + sumB;
      const expectedChecksum = (10 - (total % 10)) % 10;

      if (parseInt(clean[12], 10) !== expectedChecksum) {
        return res.status(400).json({
          valid: false,
          error: 'Invalid South African ID checksum.',
        });
      }

      const genderCode = parseInt(clean.slice(6, 10), 10);
      return res.json({
        valid: true,
        documentType: 'SA_ID',
        gender: genderCode < 5000 ? 'Female' : 'Male',
        citizenship: clean[10] === '0' ? 'South African Citizen' : 'Permanent Resident',
        dateOfBirthFormatted: `${dd.toString().padStart(2, '0')}/${mm.toString().padStart(2, '0')}/${fullYear}`,
      });
    }

    // Passport validation
    const trimmed = String(documentNumber).trim();
    if (trimmed.length < 6 || trimmed.length > 12) {
      return res.status(400).json({
        valid: false,
        error: 'Passport number must be between 6 and 12 characters in length.',
      });
    }

    if (!/^[A-Za-z0-9]+$/.test(trimmed)) {
      return res.status(400).json({
        valid: false,
        error: 'Passport number may only contain letters and numbers.',
      });
    }

    return res.json({
      valid: true,
      documentType: 'PASSPORT',
    });
  } catch (err: any) {
    return res.status(500).json({
      valid: false,
      error: 'Identity verification service error.',
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
