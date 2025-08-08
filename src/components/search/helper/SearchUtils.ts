import { SolrSuggestion, SolrSuggestResponse } from "@/store/types/search";
import SolrQueryBuilder from "./SolrQueryBuilder";

export interface SearchResult {
  searchResults: any[];
  relatedResults: any[];
  suggestions: string[];
  originalQuery: string;
  usedQuery: string;
  usedSpellCheck: boolean;
  analysis?: any;
}

export const processAndSortSuggestions = (
  suggestions: SolrSuggestion[],
  minWeight: number = 50
): string[] => {
  return suggestions
    .filter((s) => s.payload === "false")
    .filter((s) => s.weight >= minWeight)
    .map((s) => s.term)
    .sort((a, b) => {
      const weightA = suggestions.find((s) => s.term === a)?.weight || 0;
      const weightB = suggestions.find((s) => s.term === b)?.weight || 0;
      return weightB - weightA;
    });
};

export const fetchSuggestionsFromSolr = async (
  term: string,
  queryBuilder: SolrQueryBuilder
): Promise<string[]> => {
  try {
    const result = await queryBuilder.suggestQuery(term).fetchResult();
    const suggestResponse = result as unknown as SolrSuggestResponse;
    const suggestions = suggestResponse.suggest?.sdohSuggester[term]?.suggestions || [];
    return processAndSortSuggestions(suggestions);
  } catch (error) {
    console.error(`Error fetching suggestions for term "${term}":`, error);
    return [];
  }
};

export const processSolrResults = (results: any[]): any[] => {
  return results.map((result) => ({
    ...result,
    years: Array.isArray(result.years) ? result.years : Array.from(result.years || []),
  }));
};

export const deduplicateResults = (results: any[]): any[] => {
  return Array.from(new Map(results.map((item) => [item.id, item])).values());
};

export const getBaseUrl = (): string => {
  return process.env.NODE_ENV === "development" ? "http://localhost:8888" : "";
};

export const fetchChatGptAnalysis = async (question: string): Promise<any> => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/chat-search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  const responseData = await response.json();
  
  if (!response.ok) {
    if (responseData.error) {
      throw new Error(`ChatGPT search failed: ${responseData.error} - ${responseData.details || 'Please try using keyword search instead'}`);
    } else {
      throw new Error(`Failed to get search strategy: ${response.status} - The AI search service is temporarily unavailable. Please try keyword search instead.`);
    }
  }
  if (responseData.error) {
    throw new Error(`ChatGPT search failed: ${responseData.error} - ${responseData.details || 'Please try using keyword search instead'}`);
  }
  return responseData;
};

export const executeQueries = async (
  queries: string[],
  queryBuilder: SolrQueryBuilder
): Promise<any[]> => {
  const results = await Promise.all(
    queries.map(async (q: string) => {
      try {
        const result = await queryBuilder.directlyQuery(q).fetchResult();
        return result.results || [];
      } catch (error) {
        console.error(`Error fetching results for query "${q}":`, error);
        return [];
      }
    })
  );
  
  return results.flat();
}; 