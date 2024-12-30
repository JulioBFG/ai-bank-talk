"use client"
import React, { useState, FormEvent } from "react";
import { SendHorizontal } from "lucide-react";
import Markdown from "react-markdown";
import { getGeminiResponse } from "../api/api";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SkeletonLoading from "@/components/SkeletonLoading/SkeletonLoading";

function App() {
  const [prompt, setPrompt] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);

  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (prompt.trim() === "") return;

    try {
      setLoading(true);
      const responseText = await getGeminiResponse(prompt);
      if (responseText !== null && responseText !== undefined) {
        setQuestions([...questions, prompt]);
        setResponses([...responses, responseText.response]);
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
        <div className="conversation space-y-4 p-4 overflow-y-auto max-h-[60vh]">
          {questions.map((question, index) => (
            <React.Fragment key={index}>
              <div className="flex w-full">
                {question && <div className={"balloon max-w-2/3 break-words rounded-lg p-3 bg-green-500 text-white ml-auto rounded-br-none"}><Markdown>{question}</Markdown></div>}
              </div>
              <div className="flex w-full">
                <div className={"balloon max-w-2/3 break-words rounded-lg p-3 bg-gray-600 text-white mr-auto rounded-bl-none "}>
                  {index === responses.length - 1 && loading ? (
                    <SkeletonLoading />
                  ) : (
                    <Markdown className="text-white break-words">{responses[index]}</Markdown>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex w-full gap-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Sam"
              className="text-white bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
            <Button variant="secondary" type="submit" className="h-12 m-auto">
              <SendHorizontal />
            </Button>
          </div>
        </form>
      </div>
    </div >
  );
}

export default App;