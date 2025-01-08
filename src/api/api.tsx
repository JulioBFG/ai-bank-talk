import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY ?? '';
const genAI = new GoogleGenerativeAI(API_KEY);
const geminiCommand = process.env.REACT_APP_GEMINI_COMMAND ?? '';
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: geminiCommand });

const createChat = (history = []) => {
  return model.startChat({ history },);
};

const sendMessage = async (chat: ChatSession, prompt: string) => {
  const result = await chat.sendMessage(prompt);
  const response = result.response?.text();
  return response;
};

const addToHistory = (history = [], role: string, text: string) => {
  return [...history, { role, parts: [{ text }] }];
};

export const getGeminiResponse = async (prompt: string, history = []) => {
  try {
    const chat = createChat(history);
    const response = await sendMessage(chat, prompt);
    return {
      response,
      newHistory: addToHistory(history, "user", prompt).concat(addToHistory([], "model", response))
    };
  } catch (error) {
    console.error("Error generating answer:", error);
    return { response: null, newHistory: history };
  }
};