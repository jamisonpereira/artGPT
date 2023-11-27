import { Ratelimit } from "@upstash/ratelimit";
import redis from "../../utils/redis";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import OpenAI from "openai";

// Create a new ratelimiter, that allows 5 requests per 24 hours
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.fixedWindow(5, "1440 m"),
      analytics: true,
    })
  : undefined;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  console.log("*****************************");
  console.log("ENTERED ROUTE");
  // console.log("request:", request);
  console.log("*****************************");
  // Rate Limiter Code
  if (ratelimit) {
    const headersList = headers();
    const ipIdentifier = headersList.get("x-real-ip");

    const result = await ratelimit.limit(ipIdentifier ?? "");

    if (!result.success) {
      return new Response(
        "Too many uploads in 1 day. Please try again in a 24 hours.",
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": result.limit,
            "X-RateLimit-Remaining": result.remaining,
          } as any,
        }
      );
    }
  }

  const { imageUrl } = await request.json();
  console.log("imageUrl:", imageUrl);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      // response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an interior designer that will help create a design brief for a generative AI model to create a unique image that will fit beautifully into a space as a piece of artwork. Format your response as a JSON Object with the following format: 
          
          Example JSON:
          {
            "analysis": <your analysis>",
            "brief": {
              "artworkStyle": <your response>,
              "colorPalette": <your response>,
              "imageryMotifs": <your response>,
              "composition": <your response>,
              "medium": <your response>,
              "finish": <your response>,
              "additionalNotes": <your response>
            } 
          }
          
          Use the following step-by-step instructions to respond to user inputs:

          Step 1: The user will provide you with a photo of a room. Analyze the photo by looking at things like overall style, color scheme, etc. Summarize your analysis in a few sentences and store it as the value under the "analysis" key of the JSON object.

          Step 2: Develop a design brief for the generative AI model following the template below. Store the design brief as the values under the "brief" key of the JSON object, with each element of the template being it's own key. Important! Your brief should only give direction on the artwork creation. Do not make any reference to the room or the furniture within it. Do not provide reasoning for your direction (i.e. do not say things like "to harmonize with the room's existing hues"). Do not talk about the frame or framing.  
          `,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });
    // console.log("Response complete: ", response);
    // console.log(response.choices[0].message);
    // console.log("content type: ", typeof response.choices[0].message.content);
    console.log(response.choices[0].message.content);
    const cleanedJsonString = response.choices[0].message.content
      ?.trim()
      .replace(/^```json\n/, "")
      .replace(/\n```$/, "");
    console.log("cleanedJsonString:", cleanedJsonString);
    return NextResponse.json(cleanedJsonString);
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
