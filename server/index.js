import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
const LOCATION = process.env.GCP_LOCATION || 'us-central1';

// Initialize Vertex AI
const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash', // Standard model for Vertex
});

// AI Chat Endpoint (The Secure Proxy)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, systemInstruction } = req.body;

    const chat = generativeModel.startChat({
        history: history || [],
        systemInstruction: systemInstruction,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.candidates[0].content.parts[0].text;

    res.json({ text });
  } catch (error) {
    console.error('Vertex AI Error:', error);
    res.status(500).json({ error: 'Failed to communicate with Vertex AI. Ensure Service Account has "Vertex AI User" role.' });
  }
});

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using Project ID: ${PROJECT_ID}`);
});
