import React from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner/Spinner";
import { SendHorizontal } from "lucide-react";

interface TChatForm {
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  loading: boolean;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  prompt: string
}

const ChatForm = ({ handleSubmit, loading, setPrompt, prompt }: TChatForm) => {
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex w-full gap-2">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Sam"
          className="text-white bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
        />
        <Button variant="secondary" type="submit" className="h-12 m-auto">
          {loading ? <Spinner /> : <SendHorizontal />}
        </Button>
      </div>
    </form>
  )
}

export default ChatForm