import { tool } from "@openai/agents";
import { z } from "zod";

// Tool to open and read content from a URL
export const openLinkTool = tool({
  name: "open_link",
  description: "Open a URL and extract its content",
  parameters: z.object({
    url: z.string().describe("The URL to open, MUST be a valid URL"),
  }),
  execute: async ({ url }) => {
    try {
      const response = await fetch(url);
      const content = await response.text();
      return content;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to open link: ${error.message}`);
      }
      throw new Error("Failed to open link: Unknown error");
    }
  },
});

// Tool to generate audio from text using OpenAI TTS
export const generateAudioTool = tool({
  name: "generate_audio",
  description: "Generate audio from text using OpenAI TTS",
  parameters: z.object({
    text: z.string(),
  }),
  execute: async ({ text }) => {
    try {
      // TODO: Implement actual OpenAI TTS API call
      // For now, return a mock response
      console.log(`Generating audio for text: ${text}`);
      return {
        audioUrl: "https://example.com/audio.mp3",
        duration: 30,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate audio: ${error.message}`);
      }
      throw new Error("Failed to generate audio: Unknown error");
    }
  },
});

// Tool to generate video using Reeroll API
export const generateVideoTool = tool({
  name: "generate_video",
  description: "Generate a video using Reeroll API",
  parameters: z.object({
    script: z.string(),
    audioUrl: z.string().url(),
  }),
  execute: async ({ script, audioUrl }) => {
    try {
      // TODO: Implement actual Reeroll API call
      // For now, return a mock response
      console.log(
        `Generating video for script: ${script} with audio: ${audioUrl}`
      );
      return {
        videoUrl: "https://example.com/video.mp4",
        duration: 60,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate video: ${error.message}`);
      }
      throw new Error("Failed to generate video: Unknown error");
    }
  },
});
