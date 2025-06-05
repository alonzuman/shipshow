import { run } from '@openai/agents';
import {
  creativeDirectorAgent,
  copywriterAgent,
  voiceoverProducerAgent,
  videoProducerAgent,
  shipShowAgent,
} from './agents';

export type MarketingPackage = {
  productInfo: {
    name: string;
    summary: string;
    tone: string;
    targetAudience: string;
  };
  scripts: {
    [platform: string]: string;
  };
  audio: {
    [platform: string]: string;
  };
  videos: {
    [platform: string]: string;
  };
};

export async function generateMarketingPackage(url: string): Promise<MarketingPackage> {
  // Step 1: Creative Director analyzes the product
  const productAnalysisResult = await run(creativeDirectorAgent, `Analyze this product URL and create a creative brief: ${url}`);
  const productAnalysisContent = productAnalysisResult.output[0].output || '';
  const productAnalysis = JSON.parse(productAnalysisContent);

  // Step 2: Copywriter creates scripts for each platform
  const platforms = ['tiktok', 'instagram', 'youtube', 'linkedin'];
  const scripts: { [key: string]: string } = {};
  
  for (const platform of platforms) {
    const scriptResult = await run(copywriterAgent, `Create a ${platform} script based on this creative brief: ${JSON.stringify(productAnalysis)}`);
    const scriptContent = scriptResult.output[0].output || '';
    scripts[platform] = scriptContent;
  }

  // Step 3: Voiceover Producer generates audio for each script
  const audio: { [key: string]: string } = {};
  
  for (const [platform, script] of Object.entries(scripts)) {
    const audioResult = await run(voiceoverProducerAgent, `Generate voiceover for this ${platform} script: ${script}`);
    const audioContent = audioResult.output[0].output || '';
    const audioData = JSON.parse(audioContent);
    audio[platform] = audioData.audioUrl;
  }

  // Step 4: Video Producer creates videos for each platform
  const videos: { [key: string]: string } = {};
  
  for (const platform of platforms) {
    const videoResult = await run(videoProducerAgent, `Create a ${platform} video using this script and audio:
      Script: ${scripts[platform]}
      Audio: ${audio[platform]}`);
    const videoContent = videoResult.output[0].output || '';
    const videoData = JSON.parse(videoContent);
    videos[platform] = videoData.videoUrl;
  }

  // Step 5: ShipShow Coordinator finalizes the package
  await run(shipShowAgent, `Review and finalize this marketing package:
    Product Info: ${JSON.stringify(productAnalysis)}
    Scripts: ${JSON.stringify(scripts)}
    Audio: ${JSON.stringify(audio)}
    Videos: ${JSON.stringify(videos)}`);

  return {
    productInfo: productAnalysis,
    scripts,
    audio,
    videos,
  };
} 