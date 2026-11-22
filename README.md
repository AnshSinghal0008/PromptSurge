# PromptForge

<div align="center">

![PromptForge](https://img.shields.io/badge/PromptForge-AI%20Prompt%20Workshop-orange?style=for-the-badge&logo=openai)
![Node.js](https://img.shields.io/badge/Node.js-24.x-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Forge clearer prompts, run original and optimized instructions side by side, and compare responses with relevance, clarity, accuracy, and completeness scores.**


</div>

---

## ✨ Features

- 🔍 **Prompt Analysis** — Analyzes objective, tone, audience, weaknesses, and missing information
- ⚡ **Prompt Optimization** — Generates a significantly improved prompt while preserving original intent
- 📊 **Side-by-Side Comparison** — Runs both prompts and compares responses with four evaluation scores: relevance, clarity, accuracy, and completeness
- 🤖 **Multi-Provider AI** — Supports 5 providers (Gemini, OpenRouter, Groq, Mistral, Cohere) with automatic failover
- 🔄 **Auto-Fallback** — If one provider hits a rate limit, automatically tries the next one in 60s cooldown
- 🎛️ **User-Controlled Models** — Switch providers and models at runtime via the in-app settings panel
- 📈 **Score System** — Prompt scores (0–100) with improvement tracking
- 🕑 **History Tracking** — Optimization runs stay available in memory while the backend is running
- 📋 **Copy Buttons** — One-click copy on every prompt and response block
- 🌙 **Modern UI** — Glassmorphism dark design, fully responsive

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React |
| **Backend** | Node.js, Express.js |
| **History** | In-memory (cleared when the backend restarts) |
| **AI Providers** | Google Gemini, OpenRouter, Groq, Mistral AI, Cohere |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 🤖 Supported AI Providers

| Provider | Free Tier | Models Available |
|---|---|---|
| **Google Gemini** | 1,500 req/day | gemini-1.5-flash, gemini-1.5-pro |
| **OpenRouter** | 20 RPM, 300+ models | Gemma 2, Qwen 2, DeepSeek R1, Phi-3 |
| **Groq** | 1,000 req/day, ultra-fast | LLaMA 3.3 70B, Mixtral 8x7B, Gemma 2 |
| **Mistral AI** | Experiment plan | Mistral Small, Open Mixtral 8x7B |
| **Cohere** | 1,000 calls/month | Command R, Command R+, Command Light |

> You only need **one** API key to get started. Add more for fallback redundancy.

---

## 🚀 Local Development

### Prerequisites
- Node.js v20.19+ (or v22.12+)
- At least one free API key (see providers table above)

### 1. Clone & Install

```bash
git clone https://github.com/ravikumarghec/AI-Prompt-Generation-and-Optimization-System.git
cd AI-Prompt-Generation-and-Optimization-System

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

Create `server/.env`:

```env
PORT=5001
CLIENT_URL=http://localhost:5173

# Provider order — left = highest priority. Remove any you don't have keys for.
PROVIDER_ORDER=gemini,openrouter,groq,mistral,cohere
PROVIDER_COOLDOWN_MS=60000

# Add at least ONE of these keys:
GEMINI_API_KEY=your_key_here        # https://aistudio.google.com/
GEMINI_MODEL=gemini-1.5-flash

OPENROUTER_API_KEY=your_key_here    # https://openrouter.ai/
OPENROUTER_MODEL=google/gemma-2-9b-it:free

GROQ_API_KEY=your_key_here          # https://console.groq.com/
GROQ_MODEL=llama-3.3-70b-versatile

MISTRAL_API_KEY=your_key_here       # https://console.mistral.ai/
MISTRAL_MODEL=mistral-small-latest

COHERE_API_KEY=your_key_here        # https://dashboard.cohere.com/
COHERE_MODEL=command-r
```

### 3. Start Servers

```bash
# Terminal 1 — Backend
cd server
node server.js

# Terminal 2 — Frontend
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Deployment

The repository includes a Render Blueprint and a Vercel API rewrite for the default Render service name `promptforge-api`.

1. Push the repository to GitHub, then create a **Blueprint** on [Render](https://render.com) and select this repository. Render reads `render.yaml` and deploys the API.
2. In Render, add at least one provider key (for example `GEMINI_API_KEY`) under the service's **Environment** settings. Add any other provider keys there too; never put secrets in Git.
3. Wait for the Render service to become healthy at `https://promptforge-api.onrender.com/health`.
4. Import the same repository on [Vercel](https://vercel.com), set **Root Directory** to `client`, and deploy with the Vite defaults.
5. The included `client/vercel.json` forwards `/api/*` to the Render service. If Render assigns a different service URL, update that destination before deploying the frontend. Alternatively, set `VITE_API_URL` in Vercel to the API base URL ending in `/api`.
6. If using a custom frontend domain, set `CLIENT_URL` in Render to that exact origin.

History is currently held in backend memory, so it resets when the Render service restarts or redeploys.

---

## 🔧 How the Multi-Provider Fallback Works

```
User submits a prompt
  │
  ▼
ProviderManager tries providers in PROVIDER_ORDER
  ├─ Gemini ──── OK? → return result ✅
  │               └─ 429/401/404? → mark exhausted (60s cooldown) → try next
  ├─ OpenRouter ─ OK? → return result ✅
  │               └─ error? → mark exhausted → try next
  ├─ Groq ─────── OK? → return result ✅
  │               └─ error? → mark exhausted → try next
  ├─ Mistral ──── OK? → return result ✅
  └─ Cohere ───── OK? → return result ✅
                  └─ all exhausted? → return error with details
```

After 60 seconds, exhausted providers automatically reset and are tried again.

---

## 📁 Project Structure

```
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Provider health indicator
│   │   │   ├── ProviderSelector.jsx # Settings panel
│   │   │   ├── PromptInput.jsx    # Input with provider chip
│   │   │   └── ResultsView.jsx    # Score rings, comparison, copy buttons
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── History.jsx        # With provider attribution
│   │   └── services/api.js
│   └── vercel.json               # API proxy rewrites for production
│
└── server/                   # Express backend
    ├── routes/api.js              # REST endpoints
    ├── services/
    │   ├── providerManager.js     # Fallback engine
    │   ├── geminiService.js       # Prompt processing logic
    │   └── providers/             # Per-provider adapters
    │       ├── geminiProvider.js
    │       ├── openrouterProvider.js
    │       ├── groqProvider.js
    │       ├── mistralProvider.js
    │       └── cohereProvider.js
    └── server.js                  # Express app + CORS
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/prompts/process` | Process & optimize a prompt |
| `GET` | `/api/history` | Get all history |
| `DELETE` | `/api/history/:id` | Delete a history item |
| `GET` | `/api/providers/status` | Real-time provider health |
| `GET` | `/api/providers/models` | Available models per provider |
| `GET` | `/api/test-gemini` | Test active provider connection |
| `GET` | `/health` | Server health check |

**POST `/api/prompts/process` body:**
```json
{
  "prompt": "your prompt here",
  "provider": "groq",        // optional — override auto-fallback
  "model": "gemma2-9b-it"   // optional — override default model
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
Made by <a href="https://github.com/ravikumarghec">ravikumarghec</a>
</div>
