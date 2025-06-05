"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect } from "react";
import Markdown, { Components } from "react-markdown";

interface StreamEvent {
  event: "agent_updated_stream_event" | "run_item_stream_event";
  name: string;
  type?: "function_call" | "function_call_result" | "message";
  arguments?: string;
  output?: {
    type: string;
    text: string;
  };
  id?: string;
  callId?: string;
  status?: string;
  role?: string;
  content?: Array<{
    type: string;
    text: string;
  }>;
}

const markdownComponents: Components = {
  a: ({ ...props }) => {
    return <a {...props} className="text-blue-500" target="_blank" />;
  },
  p: ({ ...props }) => {
    return <p {...props} className="mb-2" />;
  },
  ul: ({ ...props }) => {
    return <ul {...props} className="list-disc pl-4" />;
  },
};

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
              <Markdown components={markdownComponents}>
                {`### Current Agent: ${streamEvent.name}`}
              </Markdown>
            </div>
          );
        }

        if (streamEvent.event === "run_item_stream_event") {
          if (streamEvent.type === "function_call") {
            return (
              <div key={index} className="mb-4">
                <Markdown components={markdownComponents}>
                  {`#### Function Call: ${streamEvent.name} - ${streamEvent.status}`}
                </Markdown>
                {/* <div className="ml-4">
                  {streamEvent.id && <div>ID: {streamEvent.id}</div>}
                  {streamEvent.callId && (
                    <div>Call ID: {streamEvent.callId}</div>
                  )}
                  {streamEvent.status && (
                    <div>Status: {streamEvent.status}</div>
                  )}
                  {streamEvent.arguments && (
                    <div>
                      <Markdown components={markdownComponents}>
                        {`\`\`\`json\n${streamEvent.arguments}\n\`\`\``}
                      </Markdown>
                    </div>
                  )}
                </div> */}
              </div>
            );
          }

          if (streamEvent.type === "message" && streamEvent.content) {
            return (
              <div key={index} className="mb-4">
                <Markdown components={markdownComponents}>
                  {`#### Message (${streamEvent.role || "unknown"})`}
                </Markdown>
                <div className="ml-4">
                  {streamEvent.content.map((content, contentIndex) => (
                    <div key={contentIndex}>
                      <Markdown components={markdownComponents}>
                        {content.text}
                      </Markdown>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        }

        return null;
      })}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className="mt-4">
        {status === "ready" ? (
          <input
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            onKeyDown={async (event) => {
              if (event.key === "Enter") {
                append({
                  content: data
                    ? `${JSON.stringify(data)}\n\n\n${input}`
                    : input,
                  role: "user",
                });
                setInput("");
              }
            }}
            className="w-full p-2 border rounded"
          />
        ) : status === "error" ? (
          "Ugh it broke again"
        ) : status === "submitted" ? (
          "Thinking..."
        ) : (
          "Here should be a fancy animation..."
        )}
      </div>
    </div>
  );
}
