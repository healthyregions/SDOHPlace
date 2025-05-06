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

function containsNonLatinCharacters(text) {
  const nonLatinRegex =
    /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1A20-\u1AAF\u1B00-\u1B7F\u1B80-\u1BBF\u1BC0-\u1BFF\u1C00-\u1C4F\u1C50-\u1C7F\u1C80-\u1CDF\u1D00-\u1DBF\u1E00-\u1EFF\u1F00-\u1FFF\u2000-\u206F\u2070-\u209F\u20A0-\u20CF\u20D0-\u20FF\u2100-\u214F\u2150-\u218F\u2190-\u21FF\u2200-\u22FF\u2300-\u23FF\u2400-\u243F\u2440-\u245F\u2460-\u24FF\u2500-\u257F\u2580-\u259F\u25A0-\u25FF\u2600-\u26FF\u2700-\u27BF\u27C0-\u27EF\u27F0-\u27FF\u2800-\u28FF\u2900-\u297F\u2980-\u29FF\u2A00-\u2AFF\u2B00-\u2BFF\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2E00-\u2E7F\u2E80-\u2EFF\u2F00-\u2FDF\u2FF0-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31A0-\u31BF\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA4D0-\uA4FF\uA500-\uA63F\uA640-\uA69F\uA6A0-\uA6FF\uA700-\uA71F\uA720-\uA7FF\uA800-\uA82F\uA830-\uA83F\uA840-\uA87F\uA880-\uA8DF\uA8E0-\uA8FF\uA900-\uA92F\uA930-\uA95F\uA960-\uA97F\uA980-\uA9DF\uA9E0-\uA9FF\uAA00-\uAA5F\uAA60-\uAA7F\uAA80-\uAADF\uAAE0-\uAAFF\uAB00-\uAB2F\uAB30-\uABFF\uAC00-\uD7AF\uD7B0-\uD7FF\uF900-\uFAFF\uFB00-\uFB4F\uFB50-\uFDFF\uFE00-\uFE0F\uFE10-\uFE1F\uFE20-\uFE2F\uFE30-\uFE4F\uFE50-\uFE6F\uFE70-\uFEFF\uFF00-\uFFEF\uFFF0-\uFFFF]/;
  return nonLatinRegex.test(text);
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
  if (
    !llmEndpoint ||
    !modelName ||
    (modelName.indexOf("gpt") > -1 && !openAPIKey) ||
    (llmEndpoint.indexOf("uiuc") > -1 && !uiucChatAPIKey & !courseName)
  ) {
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
      const usesNonLatinScript = containsNonLatinCharacters(
        questionData.question
      );
      let systemPrompt = gptBasedMessage;
      if (usesNonLatinScript) {
        systemPrompt += `\nIMPORTANT: The user's question is in a non-English language. Your response, especially the "thoughts" field, MUST be in the SAME LANGUAGE as the user's question. The keyTerms can be in English, but the "thoughts" explanation MUST be in the original language.`;
      } // handle non-latin characters like Hebrew, Arabic, etc.
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
                content: systemPrompt,
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
                content: systemPrompt,
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
        try {
          if (
            !content.trim().startsWith("{") ||
            !content.trim().endsWith("}")
          ) {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              content = jsonMatch[0];
            }
          }
          if (content.includes('"keyTerms"')) {
            const keyTermsRegex = /"keyTerms"\s*:\s*\[([\s\S]*?)\]/;
            const match = content.match(keyTermsRegex);
            if (match) {
              const keyTermsContent = match[1];
              if (keyTermsContent.includes("}{")) {
                const fixedContent = keyTermsContent.replace(/\}\s*\{/g, "},{");
                content = content.replace(keyTermsContent, fixedContent);
              }
            }
          }
          if (content.includes('"thoughts"')) {
            const thoughtsRegex = /"thoughts"\s*:\s*"([^"]*)"(?!\s*,)/;
            const match = content.match(thoughtsRegex);
            if (match) {
              content = content.replace(match[0], match[0] + ",");
            }
          }
          analysis = JSON.parse(content);
        } catch (error) {
          console.error("JSON parse error:", error.message);
          console.error("Problematic JSON content:", content);
          analysis = {
            thoughts:
              "We encountered an issue processing your search. Here are some general results that might be helpful.",
            keyTerms: [],
            suggestedQueries: [],
          };
          const keyTermMatches = content.match(/"term"\s*:\s*"([^"]+)"/g);
          if (keyTermMatches) {
            const extractedTerms = keyTermMatches.map((match) => {
              const term = match.match(/"term"\s*:\s*"([^"]+)"/)[1];
              return { term, score: 80, reason: "Extracted term" };
            });
            analysis.keyTerms = extractedTerms.slice(0, 5);
            analysis.suggestedQueries = analysis.keyTerms.map(
              (item) =>
                `select?q=${encodeURIComponent(
                  item.term
                )}&fq=(gbl_suppressed_b:false)&rows=1000`
            );
          }
        }
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

        if (!analysis.bbox || analysis.bbox.trim() === "") {
          analysis.suggestedQueries = analysis.suggestedQueries.map((query) => {
            return query.replace(/&fq=locn_geometry:[^&]+/g, "");
          });
        }
      } else {
        analysis.suggestedQueries = [];
      }

      if (!analysis.thoughts) {
        analysis.thoughts = "Analysis completed";
      }

      if (!analysis.keyTerms) {
        analysis.keyTerms = [];
      }

      if (!analysis.bbox) {
        analysis.bbox = "";
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

          thoughts: "Search processing encountered an error. Please try again.",
          suggestedQueries: [],
          keyTerms: [],
          bbox: "",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } else {
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

          thoughts: "Search processing encountered an error. Please try again.",
          suggestedQueries: [],
          keyTerms: [],
          bbox: "",
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
