// ./app/api/chat/route.js
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req) {
  // const { messages } = await req.json();
  const messages = [
    {
      role: "assistant",
      content:
        "Can you take this URL, parse out the method, ingredients, and prep time according the JSON+LD Recipe schema and return it as JSON? https://www.allrecipes.com/recipe/222164/easy-taco-seasoning-mix/",
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    stop: "finish",
    messages,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
