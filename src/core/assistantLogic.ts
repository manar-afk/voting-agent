import { SYSTEM_INSTRUCTION, FALLBACK_MESSAGES } from './constants';

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

/**
 * Local fallback logic for when AI is unavailable, offline, or for specific neutral responses.
 */
export function fallbackMatcher(query: string): string {
  const q = query.toLowerCase();
  
  if (q.includes("who should i vote for") || q.includes("which party") || q.includes("bjp") || q.includes("congress") || q.includes("aap")) {
    return FALLBACK_MESSAGES.NEUTRAL_FAILSAFE;
  }
  
  if (q.includes("timeline") || q.includes("date") || q.includes("schedule") || q.includes("when")) {
    return FALLBACK_MESSAGES.TIMELINE;
  }
  
  if (q.includes("booth") || q.includes("vote") || q.includes("process") || q.includes("inside") || q.includes("happen")) {
    return FALLBACK_MESSAGES.BOOTH;
  }
  
  if (q.includes("form 6") || q.includes("register") || q.includes("new")) {
    return FALLBACK_MESSAGES.FORM_6;
  }
  
  if (q.includes("voter id") || q.includes("epic") || q.includes("lost")) {
    return FALLBACK_MESSAGES.VOTER_ID;
  }
  
  return FALLBACK_MESSAGES.OFFLINE;
}

/**
 * Processes a user query by first attempting to use the secure backend proxy (Vertex AI).
 */
export async function processQuery(query: string, chatHistory: ChatMessage[] = []): Promise<string> {
  const q = query.toLowerCase();
  if (q.includes("who should i vote for") || q.includes("which party")) {
    return FALLBACK_MESSAGES.NEUTRAL_FAILSAFE;
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: query,
        history: chatHistory.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        })),
        systemInstruction: SYSTEM_INSTRUCTION
      })
    });

    if (!response.ok) throw new Error('Proxy error');

    const data = await response.json();
    return data.text;
  } catch (err) {
    console.warn("AI Backend Error, using fallback:", err);
    return fallbackMatcher(query);
  }
}
