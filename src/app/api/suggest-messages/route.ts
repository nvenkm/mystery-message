// import { dbConnect } from "@/lib/dbConnect";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { dbConnect } from "@/lib/dbConnect";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";
export async function POST(req: Request) {
  try {
    const prompt = `Create a list of three questions in single string,
    do not give any extra information,
    just three questions seperate each question with a '||',
    these questions should be suitable for any general person,
    these questions are for an anonymous question platform.
    `;

    // Ask OpenAI for a streaming completion given the prompt
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      max_tokens: 2400,
      stream: true,
      prompt,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log("Failed to send message!", error);
    return Response.json(
      {
        success: false,
        message: "Unexpected error occoured!",
      },
      {
        status: 500,
      }
    );
  }
}
