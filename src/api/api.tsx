import { Message } from "@/types/message";
import { ChatSession, GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
const GEMINI_COMMAND = process.env.NEXT_PUBLIC_GEMINI_COMMAND ?? "";
const genAI = new GoogleGenerativeAI(API_KEY);

interface ResponseData {
  response: string;
  income: number;
  monthlyExpenses: {
    [category: string]: number;
  };
  goals: string[];
}

const sendMessage = async (
  chat: ChatSession,
  prompt: string,
  history: Message[]
): Promise<string> => {
  history.push({ role: "user", content: prompt });

  const result = await chat.sendMessage(prompt);
  const data = result.response?.text();
  if (data === null || data === undefined) {
    console.error("Erro: Resposta nula ou indefinida");
    return "";
  }

  try {
    const parsedData: { response: string } = JSON.parse(data);
    const response = parsedData.response;
    history.push({ role: "model", content: response });
    console.log(data);
    return response;
  } catch (error) {
    console.error("Error on analysis:", error, data);
    return "";
  }
};

export const getGeminiResponse = async (
  prompt: string,
  history: Message[] = []
) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: GEMINI_COMMAND,
    });
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };

    const chat = model.startChat({
      generationConfig,
      history: history.map((msg) => ({
        role: msg.role,
        parts: msg.content,
      })),
    });

    const response = await sendMessage(chat, prompt, history);

    return {
      response,
      newHistory: history,
    };
  } catch (error) {
    console.error("General Error:", error);
    return { response: null, newHistory: history };
  }
};
