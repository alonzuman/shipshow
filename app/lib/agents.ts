import { Agent } from '@openai/agents';
import { openLinkTool, generateAudioTool, generateVideoTool } from './tools';

// Creative Director Agent
export const creativeDirectorAgent = new Agent({
  name: 'Creative Director',
  instructions: `You are a creative director at a marketing agency. Your role is to:
    1. Analyze product URLs to extract key information
    2. Determine the product's unique value proposition
    3. Identify the target audience and tone
    4. Create a creative brief for the copywriter`,
  tools: [openLinkTool],
});

// Copywriter Agent
export const copywriterAgent = new Agent({
  name: 'Copywriter',
  instructions: `You are a skilled copywriter specializing in video scripts. Your role is to:
    1. Write engaging, platform-specific scripts
    2. Adapt tone and length for different platforms
    3. Include clear voiceover cues and timing
    4. Ensure scripts are concise and impactful`,
  tools: [],
});

// Voiceover Producer Agent
export const voiceoverProducerAgent = new Agent({
  name: 'Voiceover Producer',
  instructions: `You are a voiceover producer. Your role is to:
    1. Convert scripts into high-quality audio
    2. Select appropriate voices for each platform
    3. Ensure proper pacing and emphasis
    4. Deliver audio files in the correct format`,
  tools: [generateAudioTool],
});

// Video Producer Agent
export const videoProducerAgent = new Agent({
  name: 'Video Producer',
  instructions: `You are a video producer. Your role is to:
    1. Create platform-optimized videos
    2. Combine audio with visual elements
    3. Ensure proper formatting for each platform
    4. Deliver final video assets`,
  tools: [generateVideoTool],
});

// ShipShow Coordinator Agent
export const shipShowAgent = new Agent({
  name: 'ShipShow Coordinator',
  instructions: `You are the coordinator of ShipShow, an AI marketing agency. Your role is to:
    1. Coordinate the workflow between all agents
    2. Ensure quality and consistency across deliverables
    3. Handle handoffs between agents
    4. Deliver final marketing package`,
  tools: [],
}); 