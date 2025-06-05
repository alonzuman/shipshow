import { tool } from "@openai/agents";
import { z } from "zod";
import OpenAI from "openai";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    voice: z
      .enum(["alloy", "echo", "fable", "onyx", "nova", "shimmer"])
      .default("nova"),
    model: z.enum(["tts-1", "tts-1-hd"]).default("tts-1"),
    speed: z.number().min(0.25).max(4.0).default(1.0),
  }),
  execute: async ({ text, voice, model, speed }) => {
    try {
      const response = await openai.audio.speech.create({
        model: model,
        voice: voice,
        input: text,
        speed: speed,
      });

      // Convert the response to a buffer
      const buffer = Buffer.from(await response.arrayBuffer());

      // Generate a unique filename using nanoid
      const filename = `${nanoid()}.mp3`;
      const path = `shipshow/${filename}`;

      // Upload to Vercel Blob
      const blob = await put(path, buffer, {
        access: "public",
        contentType: "audio/mpeg",
      });

      console.log(`Generated and uploaded audio file: ${path}`);

      return {
        audioUrl: blob.url,
        duration: Math.ceil(text.length / 15), // Rough estimate: 15 chars per second
        filename: filename,
        path: path,
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
    script: z
      .string()
      .describe(
        "A highly detailed script for the video, mention style, timestamps, provide links to images, videos etc if you have (like audio files, images, videos, etc)"
      ),
  }),
  execute: async ({ script }) => {
    try {
      // TODO: Implement actual Reeroll API call
      // For now, return a mock response
      console.log(`Generating video for script: ${script}`);
      return {
        videoUrl: "https://reeroll.com/c/8ad8eb0c-01f8-4fe7-bd52-9b9864f4a449",
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
