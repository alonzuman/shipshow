import { createDataStreamResponse, streamText, tool, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { run as runAgent } from "../agents";

export const maxDuration = 600; // 10 minutes

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const stream = createDataStreamResponse({
    execute: async (dataStream) => {
      dataStream.writeData({
        status: "starting",
        previousMessageId: messages[messages.length - 1].id,
      });

      const result = streamText({
        model: openai("gpt-4.1"),
        system:
          "You are a helpful assistant. You can run the agents to get the information you need. You can also use the tools to get the information you need.",
        messages,
        maxRetries: 3,
        onError: (error) => {
          console.error(error);
          dataStream.writeData({
            status: "error",
            previousMessageId: messages[messages.length - 1].id,
            error:
              error.error instanceof Error
                ? error.error.message
                : "Unknown error",
          });
        },
        tools: {
          runAgents: tool({
            description: "Run the agents",
            parameters: z.object({
              prompt: z.string(),
            }),
            execute: async ({ prompt }) => {
              const result = await runAgent(prompt);

              //   Merge the result to the stream
              for await (const chunk of result.toStream()) {
                if (chunk.type === "run_item_stream_event") {
                  dataStream.writeData({
                    event: "run_item_stream_event",
                    previousMessageId: messages[messages.length - 1].id,
                    ...chunk?.item?.rawItem,
                  });
                }

                if (chunk.type === "agent_updated_stream_event") {
                  dataStream.writeData({
                    event: "agent_updated_stream_event",
                    previousMessageId: messages[messages.length - 1].id,
                    ...chunk?.agent.toJSON(),
                  });
                }
              }

              console.log(result.finalOutput);

              return { ok: true, result: result.finalOutput };
            },
          }),
        },
        onFinish: (result) => {
          console.log(result);

          dataStream.writeData({
            status: "completed",
            previousMessageId: messages[messages.length - 1].id,
          });
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
  });

  return stream;
}
