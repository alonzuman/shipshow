"use client";
import React, { useState } from "react";

export default function Page() {
  const [stream, setStream] = useState<string>("");

  return (
    <>
      <form
        className=""
        onSubmit={async (e) => {
          e.preventDefault();

          const formData = new FormData(e.target as HTMLFormElement);
          const url = formData.get("url") as string;

          const response = await fetch("/api", {
            method: "POST",
            body: JSON.stringify({ url }),
          });

          const reader = response.body?.getReader();
          if (!reader) return;

          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = decoder.decode(value, { stream: true });
            setStream((old) => old + text);
          }
        }}
      >
        <h1>shipshow</h1>
        <p>you ship your product, and we will show it to the world</p>
        <textarea name="url" className="border" />
        <button>Ship</button>
      </form>
      <pre>{JSON.stringify(stream, null, 2)}</pre>
    </>
  );
}
