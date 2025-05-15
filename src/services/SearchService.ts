import SolrQueryBuilder from "../components/search/helper/SolrQueryBuilder";
import { 
  SearchResult, 
  deduplicateResults, 
  executeQueries, 
  fetchChatGptAnalysis, 
  fetchSuggestionsFromSolr, 
  processSolrResults 
} from "../components/search/helper/SearchUtils";
import suggestionManager from "../components/search/helper/SuggestionManager";
import { SolrSuggestResponse } from "@/store/types/search";
import { adaptiveScoreFilter, scoreConfig } from "../components/search/helper/FilterByScore";

export class SearchService {
  private queryBuilder: SolrQueryBuilder;
  constructor(schema: any) {
    this.queryBuilder = new SolrQueryBuilder();
    this.queryBuilder.setSchema(schema);
  }
  async performChatGptSearch(
    question: string,
    filterQueries: Array<any>
  ): Promise<SearchResult> {
    try {
      const analysis = await fetchChatGptAnalysis(question);
      if (!analysis.suggestedQueries || analysis.suggestedQueries.length === 0) {
        return {
          searchResults: [],
          relatedResults: [],
          suggestions: [],
          originalQuery: question,
          usedQuery: "",
          usedSpellCheck: false,
          analysis,
        };
      }      
      const combinedResults = await executeQueries(
        analysis.suggestedQueries,
        this.queryBuilder
      );
      let uniqueResults = deduplicateResults(combinedResults);
      let relatedResults = [];
      /* Disabling related results fetching for AI search
      if ((uniqueResults.length === 0 || analysis.keyTerms) && analysis.keyTerms && analysis.keyTerms.length > 0) {
        relatedResults = await this.getRelatedResultsFromKeyTerms(analysis.keyTerms, filterQueries, uniqueResults);
      }
      */
      return {
        searchResults: uniqueResults,
        relatedResults,
        suggestions: [],
        originalQuery: question,
        usedQuery: analysis.suggestedQueries.join(", "),
        usedSpellCheck: false,
        analysis,
      };
    } catch (error) {
      throw new Error(`ChatGPT search failed: ${error.message}`);
    }
  }

  /* Disabling related results fetching from key terms
  private async getRelatedResultsFromKeyTerms(
    keyTerms: any[],
    filterQueries: Array<any>,
    mainResults: any[]
  ): Promise<any[]> {
    const processedKeyTerms = keyTerms
      .map(term => typeof term === 'object' ? term.term : term)
      .filter(Boolean);
    const relatedSuggestions = await Promise.all(
      processedKeyTerms.map(term => fetchSuggestionsFromSolr(term, this.queryBuilder))
    );
    const allSuggestions = relatedSuggestions.flat();
    const relatedSearchResults = [];
    for (const term of allSuggestions) {
      if (suggestionManager.hasSuggestion(term)) continue;
      try {
        suggestionManager.addSuggestion(term);
        this.queryBuilder.combineQueries(term, filterQueries);
        const { results } = await this.queryBuilder.fetchResult();
        suggestionManager.removeSuggestion(term);
        if (results && results.length > 0) {
          relatedSearchResults.push(...results);
        }
      } catch (error) {
        suggestionManager.removeSuggestion(term);
        console.error(`Error fetching related results for term "${term}":`, error);
      }
    }
    const combinedRelatedResults = relatedSearchResults;
    let relatedResults = deduplicateResults(combinedRelatedResults);
    const mainResultIds = new Set(mainResults.map(item => item.id));
    return relatedResults.filter(item => !mainResultIds.has(item.id));
  }
  */

  async fetchSearchWithRelated(
    query: string,
    filterQueries: Array<any>,
    sortBy?: string,
    sortOrder?: string,
    skipCache: boolean = false,
    isAiSearch: boolean = false
  ): Promise<SearchResult> {
    this.queryBuilder.combineQueries(query, filterQueries);
    const { results: searchResults, spellCheckSuggestion } =
      await this.queryBuilder.fetchResult(undefined, skipCache);
    let finalResults = searchResults;
    let usedQuery = query;
    let usedSpellCheck = false;
    if (
      (!searchResults || searchResults.length === 0) &&
      spellCheckSuggestion &&
      spellCheckSuggestion !== query
    ) {
      this.queryBuilder.combineQueries(
        spellCheckSuggestion,
        filterQueries
      );
      const { results: spellCheckResults } =
        await this.queryBuilder.fetchResult(undefined, skipCache);
      
      if (spellCheckResults && spellCheckResults.length > 0) {
        finalResults = spellCheckResults;
        usedQuery = spellCheckSuggestion;
        usedSpellCheck = true;
      }
    }
    finalResults = processSolrResults(finalResults);
    return {
      searchResults: finalResults,
      relatedResults: [],
      suggestions: [], // Always return empty suggestions to prevent related results fetching
      originalQuery: query,
      usedQuery,
      usedSpellCheck,
    };
  }

  async getSearchSuggestions(term: string): Promise<string[]> {
    return fetchSuggestionsFromSolr(term, this.queryBuilder);
  }
} 