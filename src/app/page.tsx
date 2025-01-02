"use client"
import React, { useState, FormEvent } from "react";
import { getGeminiResponse } from "../api/api";
import ChatForm from "@/components/ChatForm/ChatForm";
import Questions from "@/components/Questions/Questions";

function App() {
  const [prompt, setPrompt] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (prompt.trim() === "") return;

    try {
      setLoading(true);
      const responseText = await getGeminiResponse(prompt);
      if (responseText !== null && responseText !== undefined) {
        setQuestions([...questions, prompt]);
        setResponses([...responses, responseText?.response ?? '']);
        setPrompt("");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex y-5 bg-gray-800 h-screen">
      <div className="m-auto w-1/2 px-4 py-8 bg-gray-700 rounded-lg shadow-lg">
        <h1 className="text-gray-100 w-full my-5 text-2xl font-bold text-center">
          Talk with Sam
        </h1>
        <div className="space-y-4 p-4 overflow-y-auto max-h-[60vh]">
          <Questions loading={loading} questions={questions} responses={responses} />
          <ChatForm
            handleSubmit={handleSubmit}
            loading={loading}
            setPrompt={setPrompt}
            prompt={prompt}
          />
        </div>
      </div>
    </div>
  );
}

export default App;