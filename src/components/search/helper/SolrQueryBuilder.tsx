import { initSolrObject } from "meta/helper/solrObjects";
import { SolrObject } from "meta/interface/SolrObject";

export default class SolrQueryBuilder {
	private query: QueryObject = {
		solrUrl: process.env.NEXT_PUBLIC_SOLR_URL || "",
		query: "",
	};

	// Method to set the basic query string. Don't call this. Call individual query methods instead.
	// TODO: if our query will have more syntax, move the select part to individual query methods
	setQuery(queryString: string): SolrQueryBuilder {
		this.query.query = `${this.query.solrUrl}/select?q=${queryString}`;
		return this;
	}

	public fetchResult(): Promise<SolrObject[]> {
		console.log("Request query:", this.query.query);
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
	getSearchResult(response_json: any): SolrObject[] {
		let result = [] as SolrObject[];
		const rawSolrObjects =
			response_json.response && response_json.response.docs
				? response_json.response.docs
				: [];
		rawSolrObjects.forEach((rawSolrObject) => {
			result.push(initSolrObject(rawSolrObject));
		});
		return result;
	}

	/**
	 * Search Methods based on Solr syntax. Not all methods are used in the search component
	 *
	 * Following methods are just placeholders for now.
	 * Will add details/modify queries after we determine exact queries we want to perform.
	 * */

	public autocompleteQuery(
		prefix: string,
		limit: number = 10,
		field: string = "dct_title_s"
	): SolrQueryBuilder {
		// TODO: switch this to geoblacklight's suggester and update method accordingly
		//	const autocompleteQuery = `/suggest`;
		// return this.setQuery(autocompleteQuery);

		return this.prefixQuery(field, prefix);
	}
	public generalQuery(searchTerm: string) {
		const generalQuery = `${searchTerm}`;
		return this.setQuery(generalQuery);
	}
	public wildcardQuery(field: string, searchTerm: string): SolrQueryBuilder {
		const wildcardQuery = `${field}:${searchTerm}*`;
		return this.setQuery(wildcardQuery);
	}
	public regexQuery(field: string, regex: string): SolrQueryBuilder {
		const regexQuery = `${field}:${regex}`;
		return this.setQuery(regexQuery);
	}
	public fieldQuery(field: string, queryTerms: string): SolrQueryBuilder {
		const fieldQuery = `${field}:${queryTerms}`;
		return this.setQuery(fieldQuery);
	}
	public rangeQuery(
		field: string,
		startDate: string,
		endDate: string
	): SolrQueryBuilder {
		const rangeQuery = `${field}:[${startDate} TO ${endDate}]`;
		return this.setQuery(rangeQuery);
	}
	public fuzzyQuery(
		field: string,
		queryTerms: string,
		fuzziness: number
	): SolrQueryBuilder {
		const fuzzyQuery = `${field}:${queryTerms}~${fuzziness}`;
		return this.setQuery(fuzzyQuery);
	}
	public boostQuery(
		field: string,
		queryTerms: string,
		boost: number
	): SolrQueryBuilder {
		const boostQuery = `${field}:${queryTerms}^${boost}`;
		return this.setQuery(boostQuery);
	}
	public booleanQuery(
		queryTerms: string,
		operator: "AND" | "OR" | "NOT",
		otherQueryTerms: string
	): SolrQueryBuilder {
		const booleanQuery = `${queryTerms} ${operator} ${otherQueryTerms}`;
		return this.setQuery(booleanQuery);
	}
	public proximityQuery(
		field: string,
		queryTerms: string,
		proximity: number
	): SolrQueryBuilder {
		const proximityQuery = `${field}:${queryTerms}~${proximity}`;
		return this.setQuery(proximityQuery);
	}
	public phraseQuery(field: string, queryTerms: string): SolrQueryBuilder {
		const phraseQuery = `${field}:"${queryTerms}"`;
		return this.setQuery(phraseQuery);
	}
	public functionQuery(func: string, field: string): SolrQueryBuilder {
		const functionQuery = `${func}(${field})`;
		return this.setQuery(functionQuery);
	}
	public joinQuery(
		field1: string,
		queryTerms1: string,
		field2: string,
		queryTerms2: string
	): SolrQueryBuilder {
		const joinQuery = `${field1}:${queryTerms1} JOIN ${field2}:${queryTerms2}`;
		return this.setQuery(joinQuery);
	}
	public prefixQuery(field: string, queryTerms: string): SolrQueryBuilder {
		const prefixQuery = `${field}:${queryTerms}*`;
		return this.setQuery(prefixQuery);
	}
	public moreLikeThisQuery(
		field: string,
		queryTerms: string
	): SolrQueryBuilder {
		const mltQuery = `mlt:${field}:${queryTerms}`;
		return this.setQuery(mltQuery);
	}
	public geospatialQuery(
		field: string,
		queryTerms: string,
		distance: string,
		latitude: number,
		longitude: number
	): SolrQueryBuilder {
		const geospatialQuery = `${field}:${queryTerms} WITHIN ${distance} OF ${latitude},${longitude}`;
		return this.setQuery(geospatialQuery);
	}
	public termRangeQuery(
		field: string,
		startTerm: string,
		endTerm: string
	): SolrQueryBuilder {
		const termRangeQuery = `${field}:[${startTerm} TO ${endTerm}]`;
		return this.setQuery(termRangeQuery);
	}

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
