import { GoogleGenAI, Chat } from "@google/genai";

// Initialize Gemini
// Fix: Use import.meta.env for Vite or safe access to process
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.API_KEY : '') || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `
You are the official AI Assistant for "School Kids Life Mission", located in City View Community, Johnsonville Township, Montserrado County, Liberia.
The portal developer is Akin S. Sokpah.

Your goal is to help students, teachers, and parents navigate the portal, understand school policies, and get information about grades, events, and admissions.
Keep answers concise, professional, and encouraging.
If asked about the developer, mention Akin S. Sokpah proudly.
If asked about specific real-time database entries (like "What is my grade?"), kindly explain that you are a demo assistant and advise them to check the "Grades" tab in the dashboard.
`;

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster chat response
    },
  });
};
