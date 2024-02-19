import TermResult from "../interface/TermResult";

// include methods to parse the suggested result from the Solr query
export default class SuggestedResultBuilder {
	private result = {} as TermResult;
	private term = [] as string[];
	private suggester = "mySuggester" as string; // change this later
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
		console.log("setResultTerms", this.result);
		this.term = this.getTermsFromTermResult(this.result);
	}

	// Method to parse the suggested result from the Solr query
	private getTermsFromTermResult(response_json: TermResult): string[] {
		let result = [] as string[];
		if (!this.suggestInput) return result;
		response_json.suggest[this.suggester][
			this.suggestInput
		].suggestions.forEach((res) => {
			result.push(res["term"]);
		});
		return result;
	}
}
