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

  const { prompt } = await request.json();

  console.log("prompt:", prompt);

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Something",
      n: 1,
      //   quality: "hd",
      // size: "1024x1024",
      response_format: "b64_json",
    });
    // const image_url = response.data[0].url;
    // console.log("image_url:", image_url);
    // return NextResponse.json(image_url);

    const b64_json = response.data[0].b64_json;
    console.log("b64_json:", b64_json);
    return NextResponse.json(b64_json);

    // console.log("Response complete: ", response);
    // console.log(response.choices[0].message);
    // console.log("content type: ", typeof response.choices[0].message.content);
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
