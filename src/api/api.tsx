import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
const GEMINI_COMMAND = process.env.NEXT_PUBLIC_GEMINI_COMMAND ?? "";
const genAI = new GoogleGenerativeAI(API_KEY);

interface FinancialData {
  name?: string;
  cpf?: string;
  income?: number;
  monthlyExpenses?: {
    [category: string]: number;
  };
  objectives?: string[];
}

interface ChatHistoryItem {
  role: string;
  parts: [{ text: string }];
}

type ChatHistory = ChatHistoryItem[];

const addToHistory = (
  history: ChatHistory = [],
  role: string,
  text: string
) => {
  return [...history, { role, parts: [{ text }] }];
};

const extractDataFromJSON = (
  responseText: string
): { jsonData: FinancialData | null; text: string } => {
  try {
    // Expressão regular para extrair o JSON
    const jsonRegex = /`json\s*({[\s\S\`]*?})\s*`/g;
    const match = jsonRegex.exec(responseText);

    let jsonData = null;
    let text = responseText;

    if (match && match[1]) {
      const jsonString = match[1].trim();

      try {
        jsonData = JSON.parse(jsonString);
        text = responseText.replace(jsonRegex, "").trim();
      } catch (jsonError) {
        console.error("Error on JSON:", jsonError);
      }
    } else {
      console.warn("JSON not found.");
    }

    const cleanText = text.replace(/`/g, "");

    return { jsonData, text: cleanText };
  } catch (error) {
    console.error("Erro inesperado:", error);
    return { jsonData: null, text: responseText };
  }
};
const sendMessage = async (chat: ChatSession, prompt: string) => {
  const result = await chat.sendMessage(prompt);
  const { text } = extractDataFromJSON(result.response?.text() ?? "");
  console.log(text);
  return text;
};

const updateFinancialData = (
  context: { jsonData: FinancialData },
  extractedData: FinancialData
) => {
  context.jsonData = { ...context.jsonData, ...extractedData };

  if (extractedData.objectives && !context.jsonData.objectives) {
    context.jsonData.objectives = [];
  }
  if (extractedData.objectives) {
    context.jsonData.objectives = [
      ...(context.jsonData.objectives || []),
      ...extractedData.objectives,
    ];
  }

  return context;
};

export const getGeminiResponse = async (
  prompt: string,
  history: ChatHistory,
  context: { jsonData: FinancialData },
  financialData: FinancialData
) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: GEMINI_COMMAND,
    });

    const chat = model.startChat({ history });

    const response = await sendMessage(chat, prompt);
    console.log(response);

    const extractedData = extractDataFromJSON(response);
    console.log(extractedData);

    const newHistory = addToHistory(history, "user", prompt).concat(
      addToHistory([], "model", response)
    );

    return {
      response,
      newHistory,
      financialData,
    };
  } catch (error) {
    console.error("General Error:", error);
    return { response: null, newHistory: history, context, financialData };
  }
};
