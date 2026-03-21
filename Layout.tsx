import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateContent(prompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text;
}

export async function qualifyLead(name: string, company: string, message: string) {
  const prompt = `
    Analyze the following lead and provide a JSON response with an intentScore (0-100) and a brief aiSummary (max 2 sentences).
    Lead Name: ${name}
    Company: ${company}
    Message: ${message}
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          intentScore: { type: 'NUMBER' },
          aiSummary: { type: 'STRING' }
        },
        required: ['intentScore', 'aiSummary']
      }
    }
  });
  return JSON.parse(response.text || '{}');
}

export async function chatWithAI(history: any[], newMessage: string) {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are Aura, an advanced AI assistant for a premium digital agency. You are elegant, professional, and helpful. You answer FAQs, guide users, and generate leads by asking for their email if they seem interested in services.",
    }
  });
  
  // Replay history
  for (const msg of history) {
    if (msg.role === 'user') {
      await chat.sendMessage({ message: msg.text });
    }
  }
  
  const response = await chat.sendMessage({ message: newMessage });
  return response.text;
}
