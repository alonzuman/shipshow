import dotenv from "dotenv";
import { run } from "./agents";
dotenv.config();

async function main() {
  const result = await run("Tell me a story about a cat.");
  result.toTextStream({ compatibleWithNodeStreams: true }).pipe(process.stdout);
}

main();
