import { message } from "../../config/prompt/prompt_message.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

function handleOptions(request) {
  if (request.headers.get("Access-Control-Request-Method")) {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  return new Response(null, {
    headers: {
      Allow: "GET, HEAD, POST, OPTIONS",
    },
  });
}

function getApiKey() {
  if (typeof Deno !== "undefined") {
    const key = Deno.env.get("OPENAI_API_KEY");
    if (!key) {
      console.error("API key not found in Deno environment");
    }
    return key;
  }

  const key =
    process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!key) {
    console.error("API key not found in process environment");
  }
  return key;
}

export default async (request, context) => {
  if (request.method === "OPTIONS") {
    return handleOptions(request);
  }
  if (request.method !== "POST") {
    return new Response("Method not allowed. Please use POST.", {
      status: 405,
      headers: {
        ...corsHeaders,
        Allow: "POST, OPTIONS",
      },
    });
  }
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error(
        "OpenAI API key is not configured. Please check environment setup."
      );
    }
    let questionData;
    try {
      questionData = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON in request body",
          details: 'Please provide a JSON object with a "question" field',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    if (!questionData.question) {
      return new Response(
        JSON.stringify({
          error: "Missing question",
          details: 'Please provide a "question" field in your request',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: message,
          },
          {
            role: "user",
            content: questionData.question,
          },
        ],
        temperature: 0,
        top_p: 0.01,
        seed: 0,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 1000,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `OpenAI API error: ${errorData.error?.message || "Unknown error"}`
      );
    }
    const completion = await response.json();
    let content = completion.choices[0].message.content;
    try {
      const analysis = JSON.parse(content);
      if (analysis.suggestedQueries) {
        analysis.suggestedQueries = analysis.suggestedQueries.map((query) =>
          query.replace(/'/g, '"')
        );
      }
      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Content causing error:", content);
      return new Response(
        JSON.stringify({
          error: "Invalid JSON in API response",
          details: parseError.message,
          content: content,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Chat search error:", error);

    return new Response(
      JSON.stringify({
        error: "Analysis failed",
        details: error.message,
        env: typeof Deno !== "undefined" ? "edge" : "local",
        time: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};
