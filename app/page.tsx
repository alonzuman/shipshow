"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import Markdown, { Components } from "react-markdown";
import { CheckCircleIcon, Loader2Icon, XIcon } from "lucide-react";

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

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [data]);

  return (
    <div className="p-4 flex flex-col gap-4 max-w-2xl mx-auto" ref={divRef}>
      {!data ? (
        <>
          <h1 className="text-6xl font-bold mb-2 mt-24">
            Ship Show
          </h1>
          <p className="text-xl mb-8 max-w-2xl text-gray-500">
            Your AI-Powered Marketing Partner. Share your app&apos;s link, and
            we&apos;ll craft a complete marketing strategy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Professional Video Content</h3>
                <p className="text-gray-500">60s brand video + social cutdowns</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Studio-Quality Voiceovers</h3>
                <p className="text-gray-500">Professional audio production</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Market Research</h3>
                <p className="text-gray-500">Competitor analysis & insights</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Distribution Strategy</h3>
                <p className="text-gray-500">Success metrics & optimization</p>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {data?.map((item, index) => {
        const streamEvent = item as unknown as StreamEvent;

        if (streamEvent.event === "agent_updated_stream_event") {
          return (
            <div key={index}>
              <Markdown components={markdownComponents}>
                {`### Current Agent: ${streamEvent.name}`}
              </Markdown>
            </div>
          );
        }

        if (streamEvent.event === "run_item_stream_event") {
          if (streamEvent.type === "function_call") {
            return (
              <div key={index} className="flex items-center gap-2">
                <Markdown components={markdownComponents}>
                  {streamEvent.name}
                </Markdown>
                {streamEvent.status === "completed" ? (
                  <CheckCircleIcon className="text-green-500 h-5 w-5" />
                ) : (
                  <Loader2Icon className="animate-spin h-5 w-5" />
                )}
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
              <div key={index}>
                {/* <Markdown components={markdownComponents}>
                  {`#### Message (${streamEvent.role || "unknown"})`}
                </Markdown> */}
                {streamEvent.content.map((content, contentIndex) => (
                  <div key={contentIndex}>
                    <Markdown components={markdownComponents}>
                      {content.text}
                    </Markdown>
                  </div>
                ))}
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
            placeholder="Drop a link to your app..."
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
          <div className="flex items-center gap-2">
            <XIcon className="text-red-500 h-5 w-5" />
            <span>Ugh it broke again</span>
          </div>
        ) : status === "submitted" ? (
          <div className="flex items-center gap-2">
            <Loader2Icon className="animate-spin h-5 w-5" />
            <span>Thinking...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Loader2Icon className="animate-spin h-5 w-5" />
            <span>Here should be a fancy animation...</span>
          </div>
        )}
      </div>
    </div>
  );
}
