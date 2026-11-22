import axios from 'axios';

// VITE_API_URL can point directly at an API; otherwise use the local Vite
// proxy or the /api rewrite configured for the Vercel deployment.
const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || '/api';
};

const API_URL = getApiUrl();



export const api = {
  // ── Prompt Processing ────────────────────────────────────────────────────
  processPrompt: async (prompt, provider = null, model = null) => {
    const response = await axios.post(`${API_URL}/prompts/process`, {
      prompt,
      ...(provider && { provider }),
      ...(model && { model }),
    });
    return response.data;
  },

  // ── History ───────────────────────────────────────────────────────────────
  getHistory: async () => {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
  },

  getHistoryItem: async (id) => {
    const response = await axios.get(`${API_URL}/history/${id}`);
    return response.data;
  },

  deleteHistoryItem: async (id) => {
    const response = await axios.delete(`${API_URL}/history/${id}`);
    return response.data;
  },

  // ── Provider Management ───────────────────────────────────────────────────
  getProviderStatus: async () => {
    const response = await axios.get(`${API_URL}/providers/status`);
    return response.data;
  },

  getProviderModels: async () => {
    const response = await axios.get(`${API_URL}/providers/models`);
    return response.data;
  },

  testConnection: async () => {
    const response = await axios.get(`${API_URL}/test-gemini`);
    return response.data;
  },
};