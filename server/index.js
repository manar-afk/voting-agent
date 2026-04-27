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

// Health Check Endpoint (For Cloud Run)
app.get('/health', (req, res) => res.send('OK'));
app.get('/', (req, res) => res.send('Voter-saathi API is running!'));

const PORT = process.env.PORT || 8080;
const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
const LOCATION = process.env.GCP_LOCATION || 'us-central1';

let generativeModel = null;

function getModel() {
  if (generativeModel) return generativeModel;
  
  const vertexConfig = { location: LOCATION };
  if (PROJECT_ID) vertexConfig.project = PROJECT_ID;

  const vertexAI = new VertexAI(vertexConfig);
  generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });
  return generativeModel;
}

// AI Chat Endpoint (The Secure Proxy)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, systemInstruction } = req.body;
    const model = getModel();

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using Project ID: ${PROJECT_ID || 'auto-detected'}`);
});
