"use client";
import React, { useState, FormEvent } from "react";
import Markdown from "react-markdown";
import { getGeminiResponse } from "../api/api";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SkeletonLoading from "@/components/SkeletonLoading/SkeletonLoading";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      const responseText = await getGeminiResponse(prompt);
      if (responseText !== null && responseText !== undefined) {
        setResponse(responseText);
        setLoading(false)
      }
    } catch (error) {
      console.error("Erro:", error);
      setResponse("Ocorreu um erro ao consultar a API.");
    }
  };

  return (
    <div className="flex y-5">
      <div className="m-auto w-1/2 px-4">
        <h1 className="text-gray-100 w-full my-5">Converse Com o Gemini</h1>
        <div className="my-5">
          <h3 className="text-gray-100">Resposta:</h3>
          {loading ? <SkeletonLoading /> : <Markdown className="text-gray-100">{response}</Markdown>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex w-full gap-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Digite seu prompt"
              className="text-white"
            />
            <Button variant="secondary" type="submit">
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
