import { getVertexAI, getGenerativeModel } from "firebase/vertexai";
import { app } from '../firebaseConfig';

// System instructions for the Voter-saathi persona
const SYSTEM_INSTRUCTION = `
You are "Voter-saathi," a dedicated, hyper-localized Indian Election Assistant. 
Your mission is to empower every citizen with accurate, real-time, and simplified election information.

CURRENT PHASE & CONTEXT (April 2026):
General Elections to Legislative Assemblies are active in Assam, Kerala, Puducherry, Tamil Nadu, and West Bengal, plus bye-elections in Goa, Karnataka, Maharashtra, Nagaland, and Tripura.

RULES:
1. Identify forms: Form 6 for new voters, Form 8 for corrections on NVSP.
2. First-Timer Cutoff: 18 years of age as of Jan 1st/April 1st/July 1st/Oct 1st.
3. Paid Holiday: Mention Section 135B of the RPA 1951 for commuters.
4. IDs: Voter ID (EPIC) is NOT the only way to vote. There are 12 alternative IDs (Aadhaar, PAN, MGNREGA Card, Passport, etc.).
5. Process: Identification -> Inked Finger -> Signing Register -> Pressing the EVM Button -> Verifying the VVPAT slip.
6. Unknown Location: Instruct them exactly how to find it on the 'Electoral Search' portal using their EPIC number.
7. CRITICAL: If a user asks about political opinions or who to vote for, you MUST respond EXACTLY with:
"As your Voter Assistant, I can provide all the tools and info to help you vote, but the choice of candidate is a secret and sacred decision that belongs only to you. My job is to ensure you get to the booth comfortably."

TONE:
- Language: Simple, non-legalistic. High proficiency in translations (Hindi, Bengali, Tamil etc.).
- Empathy: Acknowledge effort (e.g. "I understand you are traveling far...").
- Formatting: Use bullet points for scannability.
- NEVER show political bias.
`;

let model = null;

if (app) {
  try {
    const vertexAI = getVertexAI(app);
    model = getGenerativeModel(vertexAI, { 
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.1,
      }
    });
  } catch(e) {
    console.error("Vertex AI Initialization Failed", e);
  }
}

export async function processQuery(query, chatHistory = []) {
  if (!model) {
    return "Firebase Configuration (API Key, Project ID) is missing in .env.local. Vertex AI cannot initialize. \n\n*Offline rule check fallback*: The choice of candidate is a secret and sacred decision that belongs only to you. My job is to ensure you get to the booth comfortably.";
  }

  try {
    let historyFormatted = chatHistory.map(msg => ({
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
    }));

    if (historyFormatted.length > 0 && historyFormatted[0].role === 'model') {
        historyFormatted.shift();
    }

    const chat = model.startChat({
        history: historyFormatted
    });
    
    // Check if the query asks about political opinions
    const politicalPatterns = [/who to vote for/i, /best party/i, /political opinion/i, /bjp/i, /congress/i, /aap/i, /tmc/i];
    const isPolitical = politicalPatterns.some(pattern => pattern.test(query));
    if (isPolitical) {
        return "As your Voter Assistant, I can provide all the tools and info to help you vote, but the choice of candidate is a secret and sacred decision that belongs only to you. My job is to ensure you get to the booth comfortably.";
    }

    const result = await chat.sendMessage([{ text: query }]);
    return result.response.text();
  } catch (error) {
    console.error("Vertex AI Error:", error);
    return "I am currently facing network issues connecting to Vertex AI via Firebase, please check standard ECI protocols on the NVSP website.";
  }
}
