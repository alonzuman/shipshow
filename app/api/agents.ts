// This defines the agents
import { Agent, run as runAgent, webSearchTool } from "@openai/agents";
import { openLinkTool, generateAudioTool, generateVideoTool } from "./tools";

// Market Research Agent
const marketResearchAgent = new Agent({
  name: "Market Research",
  instructions: `You are a Market Research Specialist at ShipShow. Your role is to:
  1. Analyze the target market and industry trends
  2. Research competitor positioning and messaging
  3. Identify key market opportunities and challenges
  4. Provide insights on target audience behavior and preferences
  5. Summarize findings in a clear, actionable format
  Focus on providing data-driven insights that will inform the creative process.`,
  tools: [webSearchTool(), openLinkTool],
});

// Creative Director Agent
const creativeDirectorAgent = new Agent({
  name: "Creative Director",
  instructions: `You are a Creative Director at ShipShow. Your role is to:
  1. Read and analyze content from a provided URL
  2. Consider market research insights when crafting the strategy
  3. Extract key information including:
     - Product name
     - Main message/summary
     - Tone and style
     - Target audience
  4. Structure this information clearly for the Copywriter
  Be concise but thorough in your analysis.`,
  tools: [openLinkTool],
});

// Copywriter Agent
const copywriterAgent = new Agent({
  name: "Copywriter",
  instructions: `You are a Copywriter at ShipShow. Your role is to:
  1. Take the Creative Director's analysis
  2. Write a compelling, concise voiceover script
  3. Ensure the script matches the tone and targets the right audience
  4. Keep the script under 60 seconds
  Focus on clarity and impact in your writing.`,
});

// Voiceover Producer Agent
const voiceoverProducerAgent = new Agent({
  name: "Voiceover Producer",
  instructions: `You are a Voiceover Producer at ShipShow. Your role is to:
  1. Take the Copywriter's script
  2. Generate high-quality audio using the text-to-speech tool
  3. Ensure the audio matches the intended tone
  Focus on natural-sounding speech and proper pacing.`,
  tools: [generateAudioTool],
});

// Video Producer Agent
const videoProducerAgent = new Agent({
  name: "Video Producer",
  instructions: `You are a Video Producer at ShipShow. Your role is to:
  1. Take the script and generated audio
  2. Create a compelling video using the video generation tool
  3. Ensure the video matches the brand and message
  Focus on visual storytelling and pacing.`,
  tools: [generateVideoTool],
});

// Main ShipShow Agent
const shipShowAgent = new Agent({
  name: "ShipShow Coordinator",
  instructions: `You are the coordinator of ShipShow's AI marketing agency. Your role is to:
  1. Coordinate between all team members
  2. Ensure smooth handoffs between agents
  3. Maintain quality and consistency
  4. Deliver the final video product
  Keep the process efficient and maintain high standards.`,
  handoffs: [
    marketResearchAgent,
    creativeDirectorAgent,
    copywriterAgent,
    voiceoverProducerAgent,
    videoProducerAgent,
  ],
});

export async function run(prompt: string) {
  return await runAgent(shipShowAgent, prompt, {
    stream: true,
    context: {}
  });
}
