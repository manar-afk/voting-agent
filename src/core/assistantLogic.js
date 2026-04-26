import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_VERTEX_API_KEY;

// System instructions for the Voter-saathi persona
const SYSTEM_INSTRUCTION = `
You are "Voter-saathi," a dedicated, hyper-localized Indian Election Assistant. 
Your mission is to empower every citizen with accurate, real-time, and simplified election information.

CURRENT PHASE & CONTEXT (April 2026):
General Elections to Legislative Assemblies are active in Assam, Kerala, Puducherry, Tamil Nadu, and West Bengal, plus bye-elections in Goa, Karnataka, Maharashtra, Nagaland, and Tripura.

RULES & MODULE A (FOUNDATION) KNOWLEDGE:
1. Forms (The Form Finder): 
   - "Form 6" is for NEW voters registering for the first time.
   - "Form 8" is for corrections of details, shifting residence, or replacing EPIC.
   - "Form 7" is for deletion or objecting to inclusion of a name.
2. Electoral Roll vs Voter ID (EPIC):
   - Make it VERY clear: Your name MUST be on the "Electoral Roll" (Voter List) to vote. 
   - A Voter ID Card (EPIC) is just an identity document. If your name is NOT on the Electoral Roll, you cannot vote, even if you have an EPIC card.
   - If your name is on the Electoral Roll but you lost your EPIC, you can still vote using one of the 12 alternative IDs (Aadhaar, PAN, Passport, Driving License, MGNREGA Job Card, Passbooks with photo, Smart Card, Health Insurance Smart Card, Pension document, Official identity cards, Official identity cards for MPs/MLAs/MLCs, Unique Disability ID).
3. First-Timer Cutoff: 18 years of age as of the next qualifying date: Jan 1st, April 1st, July 1st, or Oct 1st.
4. Paid Holiday: Mention Section 135B of the RPA 1951 for commuters.
5. Process & Polling Booth: If a user asks about what happens inside the booth, how to vote, or the voting process, you MUST include the exact text "[SHOW_BOOTH]" somewhere in your response to trigger a virtual simulation.
6. The 7-Second Rule (VVPAT): Always clarify that after pressing the EVM button, the voter must look at the VVPAT window. A printed slip with their candidate's symbol will be visible for exactly 7 seconds before dropping into a sealed box. This is the ultimate proof of their vote.
7. Unknown Location: Instruct them exactly how to find it on the 'Electoral Search' portal using their EPIC number.
8. Election Timeline: If a user asks about the election timeline, schedule, or dates, you MUST include the exact text "[SHOW_TIMELINE]" somewhere in your response. This will trigger a visual timeline UI.
9. Model Code of Conduct (MCC): If asked, explain the MCC as the "Fair Play" rules for politicians. It ensures no party uses government resources for campaigning and maintains a level playing field until the elections are over. Keep the explanation very simple and intuitive.
10. CRITICAL: If a user asks about political opinions or who to vote for, you MUST respond EXACTLY with:
"As your Voter Assistant, I can provide all the tools and info to help you vote, but the choice of candidate is a secret and sacred decision that belongs only to you. My job is to ensure you get to the booth comfortably."

TONE:
- Language: Simple, non-legalistic. High proficiency in translations (Hindi, Bengali, Tamil etc.).
- Empathy: Acknowledge effort (e.g. "I understand you are traveling far...").
- Formatting: Use bullet points for scannability.
- NEVER show political bias.
`;


let genAI = null;
let model = null;

if (apiKey && apiKey !== 'your_gemini_or_vertex_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.1,
      }
    });
  } catch (err) {
    console.error("AI Init Error:", err);
  }
}

// Fallback logic for when AI is unavailable or offline
function fallbackMatcher(query) {
  const q = query.toLowerCase();
  
  if (q.includes("timeline") || q.includes("date") || q.includes("schedule") || q.includes("when")) {
    return "Here is the official election timeline process. [SHOW_TIMELINE]";
  }
  
  if (q.includes("booth") || q.includes("vote") || q.includes("process") || q.includes("inside") || q.includes("happen")) {
    return "Let me walk you through exactly what happens inside the polling booth. [SHOW_BOOTH]";
  }
  
  if (q.includes("form 6") || q.includes("register") || q.includes("new")) {
    return "Form 6 is used by new voters to get their name on the Electoral Roll. You can find it on the official NVSP or ECI portal.";
  }
  
  if (q.includes("voter id") || q.includes("epic") || q.includes("lost")) {
    return "Remember: Your Voter ID (EPIC) is just an ID. Your name MUST be on the Electoral Roll to vote. If you lost your ID, you can use 12 alternative documents like Aadhaar or PAN.";
  }
  
  return "I am currently running in offline mode. Please use the quick action buttons above or ask me specifically about the 'timeline', the 'polling booth', or 'eligibility'.";
}

export async function processQuery(query, chatHistory = []) {
  if (!model) {
    // Graceful offline fallback
    return fallbackMatcher(query);
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

    const fullPayload = (chatHistory.length === 0) ? SYSTEM_INSTRUCTION + "\n\nUser Question: " + query : query;

    const result = await chat.sendMessage([{ text: fullPayload }]);
    return result.response.text();
  } catch (error) {
    console.error("AI Error:", error);
    // Use the robust offline fallback instead of a scary network error
    return fallbackMatcher(query);
  }
}
