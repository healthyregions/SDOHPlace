import { message } from "../../config/prompt/prompt_message.js";
import { message as gptBasedMessage } from "../../config/prompt/prompt_message_chatgpt.js";

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

function getLLMInfo() {
  if (typeof Deno !== "undefined") {
    const openAPIKey = Deno.env.get("OPENAI_API_KEY");
    const uiucChatAPIKey = Deno.env.get("UIUC_CHAT_API_KEY");
    const llmEndpoint = Deno.env.get("LLM_ENDPOINT");
    const courseName = Deno.env.get("COURSE_NAME");
    const modelName = Deno.env.get("MODEL_NAME");
    if (
      !openAPIKey ||
      !uiucChatAPIKey ||
      !llmEndpoint ||
      !courseName ||
      !modelName
    ) {
      console.error("API key not found in Deno environment");
    }
    return [openAPIKey, uiucChatAPIKey, llmEndpoint, courseName, modelName];
  }
  return [
    process.env.OPENAI_API_KEY,
    process.env.UIUC_CHAT_API_KEY,
    process.env.LLM_ENDPOINT,
    process.env.COURSE_NAME,
    process.env.MODEL_NAME,
  ];
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

  const [openAPIKey, uiucChatAPIKey, llmEndpoint, courseName, modelName] =
    getLLMInfo();
  if (!openAPIKey || !uiucChatAPIKey || !llmEndpoint || !courseName) {
    throw new Error(
      "OpenAI API key is not configured. Please check environment setup."
    );
  }
  let questionData;
  if (modelName.indexOf("gpt") > -1) {
    try {
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
      let response, analysis;
      if (llmEndpoint.indexOf("uiuc") > -1) {
        response = await fetch(llmEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: "system",
                content: gptBasedMessage,
              },
              {
                role: "user",
                content: questionData.question,
              },
            ],
            temperature: 0,
            retrieval_only: false,
            stream: true,
            openai_key: openAPIKey,
            api_key: uiucChatAPIKey,
            course_name: courseName,
          }),
        });
        analysis = await response.json();
      } else {
        response = await fetch(llmEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAPIKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: "system",
                content: gptBasedMessage,
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
        const completion = await response.json();
        let content = completion.choices[0].message.content;
        analysis = JSON.parse(content);
      }
      if (!response.ok) {
        throw new Error(
          `GPT-BASED API responded with status: ${response.status}`
        );
      }
      if (analysis.suggestedQueries) {
        analysis.suggestedQueries = analysis.suggestedQueries.map((query) =>
          query.replace(/'/g, '"')
        );
      }
      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
  } else {
    // This one is for NCSA-hosted model like "Qwen/Qwen2.5-VL-72B-Instruct", don't use it for now since there's some difference in the responses
    let currentReader = null;
    try {
      questionData = await request.json();
      if (currentReader) {
        await currentReader.cancel();
        currentReader = null;
      }
      const response = await fetch(llmEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
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
          retrieval_only: false,
          stream: true,
          openai_key: openAPIKey,
          api_key: uiucChatAPIKey,
          course_name: courseName,
        }),
      });
      if (!response.ok) {
        throw new Error(
          `UIUC.CHAT API responded with status: ${response.status}`
        );
      }
      const reader = response.body.getReader();
      currentReader = reader;
      let fullText = "";
      let keyTermsExtracted = false;
      let keyTerms = [];
      let suggestedQueries = [];
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = new TextDecoder().decode(value);
          fullText += chunk;
          if (!keyTermsExtracted && fullText.length > 100) {
            keyTerms = extractKeyTerms(fullText);
            suggestedQueries = generateSolrQueries(keyTerms);
            keyTermsExtracted = true;
          }
        }
        const finalResponse = {
          //thoughts: JSON.parse(fullText).message for non-stream version
          thoughts: fullText,
          keyTerms: keyTerms.map((term) => ({
            term: term,
            score: 80,
            reason: "Extracted from response",
          })),
          suggestedQueries: suggestedQueries.map(
            (query) =>
              `select?q=${encodeURIComponent(
                query
              )}&fq=(gbl_suppressed_b:false)&rows=1000`
          ),
          bbox: "",
        };
        const urlMatch = fullText.match(/\[(.*?)\]\((.*?)\)/);
        if (urlMatch) {
          finalResponse.sources = [
            {
              title: urlMatch[1],
              url: urlMatch[2],
            },
          ];
        }
        return new Response(JSON.stringify(finalResponse), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Streaming error:", error);
        if (currentReader) {
          await currentReader.cancel();
          currentReader = null;
        }
        throw error;
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
  }
};

function extractKeyTerms(text) {
  const words = text.toLowerCase().split(/\W+/);
  const stopWords = new Set([
    "the",
    "is",
    "at",
    "which",
    "on",
    "and",
    "a",
    "to",
    "for",
    "of",
  ]);
  return [...new Set(words)]
    .filter((word) => word.length > 3 && !stopWords.has(word))
    .slice(0, 5);
}

function generateSolrQueries(terms) {
  return terms.map((term) => term.replace(/['"]/g, ""));
}
