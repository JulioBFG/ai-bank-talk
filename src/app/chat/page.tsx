"use client";
import { getGeminiResponse } from "@/api/api";
import ChatForm from "@/components/ChatForm/ChatForm";
import Questions from "@/components/Questions/Questions";
import { Message } from "@/types/message";
import { FormEvent, useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (prompt.trim() === "") return;

    try {
      setLoading(true);
      const { response, newHistory } = await getGeminiResponse(
        prompt,
        chatHistory
      );

      if (response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "user", content: prompt },
          { role: "model", content: response },
        ]);

        setChatHistory(newHistory);
        setPrompt("");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const getQuestions = () => {
    return messages
      .filter((message) => message.role === "user")
      .map((message) => message.content);
  };

  const getResponses = () => {
    return messages
      .filter((message) => message.role === "model")
      .map((message) => message.content);
  };

  return (
    <div className="flex y-5 bg-gray-800 h-screen">
      <div className="m-auto w-1/2 px-4 py-8 bg-gray-700 rounded-lg shadow-lg">
        <h1 className="text-gray-100 w-full my-5 text-2xl font-bold text-center">
          Talk with Sam
        </h1>
        <div className="space-y-4 p-4 overflow-y-auto max-h-[60vh]">
          <Questions
            loading={loading}
            questions={getQuestions()}
            responses={getResponses()}
          />
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
