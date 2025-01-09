import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import { supabase } from "./supabase";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
const GEMINI_COMMAND = process.env.NEXT_PUBLIC_GEMINI_COMMAND ?? "";
const genAI = new GoogleGenerativeAI(API_KEY);
console.log(supabase.auth.getUserIdentities());
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

const sendMessage = async (chat: ChatSession, prompt: string) => {
  const result = await chat.sendMessage(prompt);
  return result.response?.text();
};

const addToHistory = (
  history: ChatHistory = [],
  role: string,
  text: string
) => {
  return [...history, { role, parts: [{ text }] }];
};

const convertUserDataToJSONString = (userData: FinancialData): string => {
  return JSON.stringify(userData, null, 2);
};

async function getOrCreateUserData(userId: string): Promise<FinancialData> {
  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("financial_data")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Erro on retrieve user data:", userError);
      const { data, error: insertError } = await supabase
        .from("users")
        .insert([{ id: userId, financial_data: {} }])
        .select("financial_data")
        .single();
      if (insertError) {
        throw insertError;
      }
      return data.financial_data;
    }

    return userData ? userData.financial_data || {} : {};
  } catch (error) {
    console.error("Supabase error:", error);
    throw error;
  }
}

const extractDataFromJSON = (jsonString: string): FinancialData | null => {
  try {
    const parsedData = JSON.parse(jsonString);
    return parsedData;
  } catch (error) {
    console.error("Erro ao analisar JSON:", error);
    return null;
  }
};

async function updateUserData(userId: string, financialData: FinancialData) {
  try {
    const { error: updateError } = await supabase
      .from("users")
      .update({ financial_data: financialData })
      .eq("id", userId);

    if (updateError) {
      console.error("Erro on update user data:", updateError);
      throw updateError;
    }
  } catch (error) {
    console.error("Error on Supabase:", error);
    throw error;
  }
}

export const getGeminiResponse = async (prompt: string) => {
  try {
    const userId = await supabase.auth
      .getUserIdentities()
      .then(console.log(userId));
    let financialData = await getOrCreateUserData();
    console.log(userId);

    const context = convertUserDataToJSONString(financialData);

    const promptWithContext =
      context.length > 0 ? `${context}\n\n${prompt}` : `${prompt}\n\n`;
    const geminiCommand = GEMINI_COMMAND + promptWithContext;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: geminiCommand,
    });

    const chat = model.startChat({ history });

    const response = await sendMessage(chat, prompt);

    const extractedData = extractDataFromJSON(response);

    if (extractedData) {
      financialData = { ...financialData, ...extractedData };

      if (extractedData.objectives && !financialData.objectives) {
        financialData.objectives = [];
      }
      if (extractedData.objectives) {
        financialData.objectives = [
          ...(financialData.objectives || []),
          ...extractedData.objectives,
        ];
      }

      await updateUserData(userId, financialData);
    }

    const newHistory = addToHistory(history, "user", prompt).concat(
      addToHistory([], "model", response)
    );

    return {
      response,
      newHistory,
    };
  } catch (error) {
    console.error("General Error:", error);
    return { response: null, newHistory: history };
  }
};
