import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY ?? ''
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });



export const getGeminiResponse = async (prompt: string) => {
  try {
    const result = await model.generateContent(prompt);
    const response = (result.response?.candidates ?? [])[0]?.content?.parts?.[0]?.text;
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error generating answer:", error);
    return null;
  }
};
