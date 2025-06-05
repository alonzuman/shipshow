// This defines the agents
import { Agent, run as runAgent } from "@openai/agents";

export async function run(prompt: string) {
  const agent = new Agent({
    name: "Storyteller",
    instructions:
      "You are a storyteller. You will be given a topic and you will tell a story about it.",
  });

  return await runAgent(agent, prompt, {
    stream: true,
  });
}
