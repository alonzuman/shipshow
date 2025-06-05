import { tool } from "@openai/agents";
import { z } from "zod";
import OpenAI from "openai";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { JSDOM } from "jsdom";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Tool to open and read content from a URL
export const openLinkTool = tool({
  name: "open_link",
  description:
    "Open a URL and extract its content, preserving CSS but removing unnecessary elements",
  parameters: z.object({
    url: z.string().describe("The URL to open, MUST be a valid URL"),
  }),
  execute: async ({ url }) => {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Remove unnecessary elements
      const elementsToRemove = [
        "script",
        "noscript",
        "iframe",
        "style",
        'link[rel="stylesheet"]',
        "meta",
        "svg",
        "img",
        "video",
        "audio",
        "canvas",
        "embed",
        "object",
        "applet",
        "base",
        "head",
      ];

      elementsToRemove.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => el.remove());
      });

      // Extract CSS variables and important styles
      const styles = new Set<string>();
      document.querySelectorAll("*").forEach((element) => {
        const style = element.getAttribute("style");
        if (style) {
          // Extract color-related styles
          const colorStyles = style
            .split(";")
            .filter((s) => s.includes("color") || s.includes("background"))
            .join(";");
          if (colorStyles) {
            styles.add(colorStyles);
          }
        }
      });

      // Get computed styles for important elements
      const computedStyles = new Map<string, string>();
      const importantElements = document.querySelectorAll(
        "body, main, header, footer, nav, section, article, div"
      );
      importantElements.forEach((element) => {
        const style = dom.window.getComputedStyle(element);
        const backgroundColor = style.backgroundColor;
        const color = style.color;
        if (backgroundColor || color) {
          const identifier = element.className || element.id || "element";
          computedStyles.set(
            identifier,
            `background-color: ${backgroundColor}; color: ${color}`
          );
        }
      });

      // Clean up the content
      const content = document.body.textContent?.trim() || "";

      // Create a summary of the page
      const summary = {
        content: content,
        styles: Array.from(styles),
        computedStyles: Object.fromEntries(computedStyles),
        title: document.title,
        headings: {
          h1: Array.from(document.querySelectorAll("h1")).map(
            (el) => el.textContent || ""
          ),
          h2: Array.from(document.querySelectorAll("h2")).map(
            (el) => el.textContent || ""
          ),
          h3: Array.from(document.querySelectorAll("h3")).map(
            (el) => el.textContent || ""
          ),
        },
        links: Array.from(document.querySelectorAll("a")).map((el) => ({
          text: el.textContent || "",
          href: el.getAttribute("href"),
        })),
      };

      return JSON.stringify(summary, null, 2);
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
  description:
    "Generate a short voiceover audio (10-40 seconds) for video using OpenAI TTS",
  parameters: z.object({
    text: z
      .string()
      .describe(
        "The voiceover script, should be concise and clear for a 10-40 second video"
      ),
    voice: z
      .enum(["alloy", "echo", "fable", "onyx", "nova", "shimmer"])
      .default("nova")
      .describe("Voice to use for the voiceover"),
    model: z.enum(["tts-1", "tts-1-hd"]).default("tts-1"),
    speed: z.number().min(0.25).max(4.0).default(1.0),
  }),
  execute: async ({ text, voice, model, speed }) => {
    try {
      // Estimate duration based on text length (roughly 15 chars per second)
      const estimatedDuration = Math.ceil(text.length / 15);

      // Warn if the script is too long or too short
      if (estimatedDuration > 40) {
        throw new Error(
          "Script is too long for a video voiceover (should be 10-40 seconds)"
        );
      }
      if (estimatedDuration < 10) {
        throw new Error(
          "Script is too short for a video voiceover (should be 10-40 seconds)"
        );
      }

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
      const path = `shipshow/voiceovers/${filename}`;

      // Upload to Vercel Blob
      const blob = await put(path, buffer, {
        access: "public",
        contentType: "audio/mpeg",
      });

      console.log(`Generated and uploaded voiceover audio: ${path}`);

      return {
        audioUrl: blob.url,
        duration: estimatedDuration,
        filename: filename,
        path: path,
        contentType: "audio/mpeg",
        name: "voiceover.mp3",
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate voiceover: ${error.message}`);
      }
      throw new Error("Failed to generate voiceover: Unknown error");
    }
  },
});

export const ACCEPTED_ATTACHMENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/hevc",
  "image/hevc",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/ogg",
  "video/avi",
  "video/mov",
  "video/wmv",
  "video/flv",
  "video/mpeg",
  "video/mpg",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/m4a",
  "audio/aac",
  "audio/wma",
] as const;

export const attachmentSchema = z.object({
  url: z.string(),
  contentType: z.enum(ACCEPTED_ATTACHMENT_TYPES),
  name: z.string(),
});

const messageContentSchema = z
  .string()
  .max(5000)
  .describe(
    "The full script of the video, it should be a highly detailed script for the video, mention style, timestamps, provide links to images, videos etc if you have (like audio files, images, videos, etc)"
  );

const textPartSchema = z.object({
  text: messageContentSchema,
  type: z.enum(["text"]),
});

export const userFacingModelsSchema = z.enum([
  "chat-model-mini",
  "chat-model-reasoning",
  "chat-model-reasoning-2",
  "chat-model-reasoning-3",
  "auto",
]);

export const streamChatInputSchema = z.object({
  id: z.string().uuid(),
  message: z.object({
    id: z.string().uuid(),
    createdAt: z.coerce.date(),
    role: z.enum(["user"]),
    content: messageContentSchema,
    parts: z.array(textPartSchema),
    experimental_attachments: z.array(attachmentSchema).default([]),
  }),
  model: userFacingModelsSchema,
  // TODO add here fix, retry, etc
  action: z.enum(["fix", "message"]).default("message"),
});

// Tool to generate video using Reeroll API
export const generateVideoTool = tool({
  name: "generate_video",
  description: "Generate a video using Reeroll API",
  parameters: streamChatInputSchema.pick({
    message: true,
  }),
  execute: async ({ message }) => {
    try {
      // Create the input message with proper schema
      const messageId = crypto.randomUUID();
      const chatId = crypto.randomUUID();

      const input = {
        id: chatId,
        message: {
          id: messageId,
          createdAt: new Date(),
          role: "user" as const,
          content: message.content,
          parts: [{ text: message.content, type: "text" as const }],
          experimental_attachments: message.experimental_attachments,
        },
        model: "chat-model-reasoning-3" as const,
        action: "message" as const,
      };

      // Fire and forget the API call
      fetch("https://reeroll.com/api/chat/external", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      }).catch((error) => {
        console.error("Failed to send video generation request:", error);
      });

      // Return the video URL immediately
      return {
        videoUrl: `https://reeroll.com/c/${chatId}`,
        chatId,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate video: ${error.message}`);
      }
      throw new Error("Failed to generate video: Unknown error");
    }
  },
});
