import { initSolrObject } from "meta/helper/solrObjects";
import { SolrObject } from "meta/interface/SolrObject";
import aardvark_json from "../../../pages/search/_metadata/aardvark_schema.json";
import sdoh_json from "../../../pages/search/_metadata/sdohplace_schema.json";
export default class SolrQueryBuilder {
	private query: QueryObject = {
		solrUrl: process.env.NEXT_PUBLIC_SOLR_URL || "",
		query: "",
	};

	// Method to set the basic query string. Don't call this. Call individual query methods instead.
	// TODO: if our query will have more syntax, move the select part to individual query methods
	setQuery(queryString: string): SolrQueryBuilder {
		console.log("queryString", queryString);
		this.query.query = `${this.query.solrUrl}/${queryString}`;
		return this;
	}

	public fetchResult(): Promise<SolrObject[]> {
		return new Promise((resolve, reject) => {
			fetch(this.query.query)
				.then((res) => res.json())
				.then((response) => {
					const result = this.getSearchResult(response);
					resolve(result);
				})
				.catch((error) => {
					console.error("Error performing search:", error);
					reject(error);
				});
		});
	}

	/**
	 * Based on the response from solr, return a list of SolrObjects as the search result.
	 * @param response_json object of the response from solr
	 * @returns a list of SolrObjects as the search result. If no result, return empty list.
	 */
	getSearchResult(response_json: {}): any {
		let result = [] as SolrObject[];

		//if return suggest
		if (response_json["suggest"]) return response_json;
		//if return select
		const rawSolrObjects =
			response_json["response"] && response_json["response"].docs
				? response_json["response"].docs
				: [];
		rawSolrObjects.forEach((rawSolrObject) => {
			result.push(initSolrObject(rawSolrObject));
		});
		return result;
	}

	/**
	 * Search Methods based on Solr syntax. Not all methods are used in the search component
	 * */
	public suggestQuery(searchTerm: string): SolrQueryBuilder {
		const suggestQuery = `suggest?q=${this.escapeQueryChars(searchTerm)}`;
		return this.setQuery(suggestQuery);
	}
	public contentQuery(searchTerm: string): SolrQueryBuilder {
		const contentQuery = `select?q=content:"${this.escapeQueryChars(
			searchTerm
		)}"`;
		return this.setQuery(contentQuery);
	}
	public generalQuery(searchTerm: string): SolrQueryBuilder {
		const generalQuery = `select?q=${this.escapeQueryChars(
			searchTerm
		)}&rows=1000`; //add rows to remove pagination
		return this.setQuery(generalQuery);
	}
	public filterQuery(
		searchTerms: { attribute: string; value: string }[]
	): SolrQueryBuilder {
		let filterQuery = `select?fq=`;
		searchTerms.forEach((term) => {
			term["attribute"] = this.findSolrAttribute(
				term["attribute"]
			);

			// filterQuery += `${term["attribute"]}:${this.escapeQueryChars(
			// 	term["value"]
			// )} AND `;
			filterQuery += `${term["attribute"]}:(${this.escapeQueryChars(
				term["value"]
			)} OR "${this.escapeQueryChars(term["value"])}") AND `;
		});
		filterQuery = filterQuery.slice(0, -5); //remove the last AND
		filterQuery = filterQuery += "&rows=1000";
		return this.setQuery(filterQuery);
	}

	/** Helper Functions
	 */
	escapeQueryChars(input: string): string {
		if (!input) return "*";
		return input.replace(/[-!(){}[\]^"~:*?\\]/g, "\\$&");
	}
	findSolrAttribute(key) {
		return Object.keys(aardvark_json).find((e) => e === key)
			? aardvark_json[key]["uri"]
			: Object.keys(sdoh_json).find((e) => e === key)
			? sdoh_json[key]["uri"]
			: key;
	}

	// UNCOMMENT THE FOLLOWING METHODS IF NEEDED
	// public wildcardQuery(field: string, searchTerm: string): SolrQueryBuilder {
	// 	const wildcardQuery = `select?q=${field}:${this.escapeQueryChars(searchTerm)}*`;
	// 	return this.setQuery(wildcardQuery);
	// }
	// public regexQuery(field: string, regex: string): SolrQueryBuilder {
	// 	const regexQuery = `select?q=${field}:${regex}`;
	// 	return this.setQuery(regexQuery);
	// }
	// public fieldQuery(field: string, queryTerms: string): SolrQueryBuilder {
	// 	const fieldQuery = `select?q=${field}:${queryTerms}`;
	// 	return this.setQuery(fieldQuery);
	// }
	// public rangeQuery(
	// 	field: string,
	// 	startDate: string,
	// 	endDate: string
	// ): SolrQueryBuilder {
	// 	const rangeQuery = `select?q=${field}:[${startDate} TO ${endDate}]`;
	// 	return this.setQuery(rangeQuery);
	// }
	// public fuzzyQuery(
	// 	field: string,
	// 	queryTerms: string,
	// 	fuzziness: number
	// ): SolrQueryBuilder {
	// 	const fuzzyQuery = `select?q=${field}:${queryTerms}~${fuzziness}`;
	// 	return this.setQuery(fuzzyQuery);
	// }
	// public boostQuery(
	// 	field: string,
	// 	queryTerms: string,
	// 	boost: number
	// ): SolrQueryBuilder {
	// 	const boostQuery = `select?q=${field}:${queryTerms}^${boost}`;
	// 	return this.setQuery(boostQuery);
	// }
	// public booleanQuery(
	// 	queryTerms: string,
	// 	operator: "AND" | "OR" | "NOT",
	// 	otherQueryTerms: string
	// ): SolrQueryBuilder {
	// 	const booleanQuery = `select?q=${queryTerms} ${operator} ${otherQueryTerms}`;
	// 	return this.setQuery(booleanQuery);
	// }
	// public proximityQuery(
	// 	field: string,
	// 	queryTerms: string,
	// 	proximity: number
	// ): SolrQueryBuilder {
	// 	const proximityQuery = `select?q=${field}:${queryTerms}~${proximity}`;
	// 	return this.setQuery(proximityQuery);
	// }
	// public phraseQuery(field: string, queryTerms: string): SolrQueryBuilder {
	// 	const phraseQuery = `select?q=${field}:"${queryTerms}"`;
	// 	return this.setQuery(phraseQuery);
	// }
	// public functionQuery(func: string, field: string): SolrQueryBuilder {
	// 	const functionQuery = `select?q=${func}(${field})`;
	// 	return this.setQuery(functionQuery);
	// }
	// public joinQuery(
	// 	field1: string,
	// 	queryTerms1: string,
	// 	field2: string,
	// 	queryTerms2: string
	// ): SolrQueryBuilder {
	// 	const joinQuery = `select?q=${field1}:${queryTerms1} JOIN ${field2}:${queryTerms2}`;
	// 	return this.setQuery(joinQuery);
	// }
	// public prefixQuery(field: string, queryTerms: string): SolrQueryBuilder {
	// 	const prefixQuery = `select?q=${field}:${queryTerms}*`;
	// 	return this.setQuery(prefixQuery);
	// }
	// public moreLikeThisQuery(
	// 	field: string,
	// 	queryTerms: string
	// ): SolrQueryBuilder {
	// 	const mltQuery = `select?q=mlt:${field}:${queryTerms}`;
	// 	return this.setQuery(mltQuery);
	// }
	// public geospatialQuery(
	// 	field: string,
	// 	queryTerms: string,
	// 	distance: string,
	// 	latitude: number,
	// 	longitude: number
	// ): SolrQueryBuilder {
	// 	const geospatialQuery = `select?q=${field}:${queryTerms} WITHIN ${distance} OF ${latitude},${longitude}`;
	// 	return this.setQuery(geospatialQuery);
	// }
	// public termRangeQuery(
	// 	field: string,
	// 	startTerm: string,
	// 	endTerm: string
	// ): SolrQueryBuilder {
	// 	const termRangeQuery = `select?q=${field}:[${startTerm} TO ${endTerm}]`;
	// 	return this.setQuery(termRangeQuery);
	// }

	// If we need to add sorting
	public addSort(
		field: string,
		order: "asc" | "desc" = "asc"
	): SolrQueryBuilder {
		if (!this.query.sort) {
			this.query.sort = [];
		}
		this.query.sort.push(`${field} ${order}`);
		return this;
	}
}
