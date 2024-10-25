import TermResult from "../interface/TermResult";

// include methods to parse the suggested result from the Solr query
export default class SuggestedResultBuilder {
  private result = {} as TermResult;
  private term = [] as string[];
  private suggester = "sdohSuggester" as string; // change this later
  private suggestInput = "*" as string; // change this later
  getTerms(): string[] {
    return this.term;
  }
  setSuggestInput(input: string): void {
    this.suggestInput = input;
  }
  setSuggester(suggester: string): void {
    this.suggester = suggester;
  }
  setResultTerms(result: string): void {
    this.result = JSON.parse(result) as TermResult;
    this.term = this.getTermsFromTermResult(this.result);
  }

  // Method to parse the suggested result from the Solr query
  private getTermsFromTermResult(response_json: TermResult): string[] {
    let result = [] as string[];
    if (!this.suggestInput) return result;
    if (Array.isArray(response_json)) {
      return result; // if response_json is an array
    }
    const suggestions = response_json
      ? response_json.suggest[this.suggester][this.suggestInput].suggestions
      : [];
    if (suggestions.length === 0) return result;
    if (suggestions.every((res) => res.weight < 1)) {
      // if all terms have weight <, use first term that larger than 0.5
      if (suggestions[0].weight > 0.5) result.push(suggestions[0]["term"]);
    } else {
      suggestions.forEach((res) => {
        if (res.weight >= 1) result.push(res["term"]);
      });
    }
    return result;
  }
}
