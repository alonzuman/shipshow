"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect } from "react";
import Markdown from "react-markdown";

interface StreamEvent {
  event: "agent_updated_stream_event" | "run_item_stream_event";
  name: string;
  type?: "function_call" | "function_call_result";
  arguments?: string;
  output?: {
    type: string;
    text: string;
  };
}

export default function Page() {
  const { input, setInput, append, data, status } = useChat();

  useEffect(() => {
    setInput("create a marketing plan for https://playground.com");
  }, []);

  return (
    <div className="p-4">
      {data?.map((item, index) => {
        const streamEvent = item as unknown as StreamEvent;

        if (streamEvent.event === "agent_updated_stream_event") {
          return (
            <div key={index} className="mb-4">
              <Markdown>{`### Current Agent: ${streamEvent.name}`}</Markdown>
            </div>
          );
        }

        if (streamEvent.event === "run_item_stream_event") {
          if (streamEvent.type === "function_call") {
            return (
              <div key={index} className="mb-4">
                <Markdown>{`#### Function Call: ${streamEvent.name}`}</Markdown>
                {streamEvent.arguments && (
                  <div className="ml-4">
                    <Markdown>{`\`\`\`json\n${streamEvent.arguments}\n\`\`\``}</Markdown>
                  </div>
                )}
              </div>
            );
          }

          if (streamEvent.type === "function_call_result") {
            return (
              <div key={index} className="mb-4">
                <Markdown>{`#### Result: ${streamEvent.name}`}</Markdown>
                {streamEvent.output?.text && (
                  <div className="ml-4">
                    <Markdown>{`\`\`\`json\n${streamEvent.output.text}\n\`\`\``}</Markdown>
                  </div>
                )}
              </div>
            );
          }
        }

        return null;
      })}
      <div className="mt-4">
        {status}
        <input
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
          onKeyDown={async (event) => {
            if (event.key === "Enter") {
              append({
                content: data ? `${JSON.stringify(data)}\n\n\n${input}` : input,
                role: "user",
              });
              setInput("");
            }
          }}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
}
