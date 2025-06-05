// This allows interacting with the agent stream
import { run } from "./agents";

export async function POST(req: Request) {
  const { url } = await req.json();

  const result = await run("Tell me a story about a cat.");
  const nodeStream = result.toTextStream({ compatibleWithNodeStreams: true });

  // Convert Node.js stream to Web Stream
  const webStream = new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      nodeStream.on("end", () => {
        controller.close();
      });
      nodeStream.on("error", (err) => {
        controller.error(err);
      });
    },
  });

  return new Response(webStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
