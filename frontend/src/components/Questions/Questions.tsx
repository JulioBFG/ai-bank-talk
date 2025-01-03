import React from "react";
import Markdown from "react-markdown";
import SkeletonLoading from "@/components/SkeletonLoading/SkeletonLoading";


interface TQuestions {
  questions: string[];
  responses: string[];
  loading: boolean;
}

const Questions = ({ questions, responses, loading }: TQuestions) => {
  return (<div className="space-y-4 p-4 overflow-y-auto max-h-[60vh]">
    {questions.map((question, index) => (
      <React.Fragment key={index}>
        <div className="flex w-full">
          {question &&
            <div className=" max-w-2/3 break-words rounded-lg p-3 bg-green-500 text-white ml-auto rounded-br-none">
              <Markdown>{question}</Markdown>
            </div>
          }
        </div>
        <div className="flex w-full">
          <div className="max-w-2/3 break-words rounded-lg p-3 bg-gray-600 text-white mr-auto rounded-bl-none">
            {index === responses.length - 1 && loading ? (
              <SkeletonLoading />
            ) : (
              <Markdown className="text-white break-words">{responses[index]}</Markdown>
            )}
          </div>
        </div>
      </React.Fragment>
    ))}
  </div>)
}

export default Questions
