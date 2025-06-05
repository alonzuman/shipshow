"use client";

import { useChat } from "@ai-sdk/react";

export default function Page() {
  const { input, setInput, append, data, status } = useChat();

  console.log(data);

  return (
    <div>
      <input
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            append({ content: input, role: "user" });
            setInput("");
          }
        }}
      />

      <pre>{JSON.stringify(data, null, 2)}</pre>
      {status}
    </div>
  );
}
