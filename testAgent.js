import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = "YOUR_API_KEY_HERE";
const SYSTEM_INSTRUCTION = "You are a test agent.";

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-embedding-2',
});

async function testQuery() {
  try {
    const chat = model.startChat({
        history: []
    });
    const result = await chat.sendMessage([{ text: "hello" }]);
    console.log(result.response.text());
  } catch (error) {
    console.error("AI Error:", error);
  }
}

testQuery();
