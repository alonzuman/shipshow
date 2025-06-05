"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect } from "react";
import Markdown from "react-markdown";

export default function Page() {
  const { input, setInput, append, data, status } = useChat();

  useEffect(() => {
    setInput("create a marketing plan for https://playground.com");
  }, []);

  console.log(data);

  return (
    <div>
      <pre> {JSON.stringify(data, null, 2)} </pre>

      {data?.map((item, index) => {
        if (item?.event === "agent_updated_stream_event") {
          return <Markdown key={index}>{item?.name}</Markdown>;
        }

        if (item?.event === "run_item_stream_event") {
          return item.content?.map((contentItem, contentIndex) => {
            if (contentItem.type === "output_text") {
              return <Markdown key={contentIndex}>{contentItem.text}</Markdown>;
            }

            return null;
          });
        }

        return null;
      })}
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
      />
    </div>
  );
}
