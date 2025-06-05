import { tool } from "@openai/agents";
import { z } from "zod";

// This defines the tools
export const openLinkTool = tool({
  name: "open_link",
  description: "Open a link in a new tab",
  parameters: z.object({
    url: z.string(),
  }),
  execute: async ({ url }) => {
    console.log(`Opening link: ${url}`);
    return `Link opened: ${url}`;
  },
});

export const generateAudioTool = tool({
  name: "generate_audio",
  description: "Generate an audio file from text (text to speech)",
  parameters: z.object({
    text: z.string(),
  }),
  execute: async ({ text }) => {
    console.log(`Generating audio for: ${text}`);
    return `Audio generated: ${text}`;
  },
});

export const generateVideoTool = tool({
  name: "generate_video",
  description:
    "Generate a video from a full script, and an optional audio file.",
  parameters: z.object({
    script: z.string(),
    audioFile: z.string().optional(),
  }),
  execute: async ({ script, audioFile }) => {
    console.log(`Generating video for: ${script}`);
    return `Video generated: ${script} ${audioFile ? `with audio file: ${audioFile}` : ""}`;
  },
});
