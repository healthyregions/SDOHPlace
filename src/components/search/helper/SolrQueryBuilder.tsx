import { initSolrObject } from "meta/helper/solrObjects";
import { SolrObject } from "meta/interface/SolrObject";
import { findSolrAttribute } from "meta/helper/util";
export default class SolrQueryBuilder {
	private query: QueryObject = {
		solrUrl: process.env.NEXT_PUBLIC_SOLR_URL || "",
		query: "",
		schema_json: {}
	};

	// Method to set the basic query string. Don't call this. Call individual query methods instead.
	// TODO: if our query will have more syntax, move the select part to individual query methods
	setQuery(queryString: string): SolrQueryBuilder {
		this.query.query = `${this.query.solrUrl}/${queryString}`;
		console.log("sending query:", this.query.query);
		return this;
	}
	setSchema(schema: {}): SolrQueryBuilder {
		this.query.schema_json = schema;
		return this;
	}

	public fetchResult(): Promise<SolrObject[]> {
		return new Promise((resolve, reject) => {
			fetch(this.query.query)
				.then((res) => res.json())
				.then((response) => {
					const result = this.getSearchResult(response,);
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
			result.push(initSolrObject(rawSolrObject, this.query.schema_json));
		});
		return result;
	}

	/**
	 * Search Methods based on Solr syntax. Not all methods are used in the search component
	 * */
	public suggestQuery(searchTerm: string): SolrQueryBuilder {
		const suggestQuery = `suggest?q=${encodeURIComponent(searchTerm)}`;
		return this.setQuery(suggestQuery);
	}
	public contentQuery(searchTerm: string): SolrQueryBuilder {
		const contentQuery = `select?q=content:"${encodeURIComponent(
			searchTerm
		)}"`;
		return this.setQuery(contentQuery);
	}
	public generalQuery(searchTerms: string | string[]): SolrQueryBuilder {
		let generalQuery = "select?q=";
		if (typeof searchTerms === "string") {
			generalQuery += `${encodeURIComponent(
				findSolrAttribute(searchTerms, this.query.schema_json)
			)}&rows=1000`; //add rows to remove pagination
		} else {
			searchTerms.forEach((term) => {
				generalQuery += `${encodeURIComponent(
					findSolrAttribute(term, this.query.schema_json)
				)} OR `;
			});
			generalQuery = generalQuery.slice(0, -4); //remove the last OR
			generalQuery = generalQuery += "&rows=1000"; //add rows to remove pagination
		}
		return this.setQuery(generalQuery);
	}

	public filterQuery(
		searchTerms: { attribute: string; value: string }[],
	): SolrQueryBuilder {
		let filterQuery = `select?fq=`;
		searchTerms.forEach((term) => {
			term["attribute"] = findSolrAttribute(
				term["attribute"],
				this.query.schema_json
			);
			filterQuery += `${term["attribute"]}:(${encodeURIComponent(
				term["value"]
			)} OR "${encodeURIComponent(term["value"])}") AND `;
		});
		filterQuery = filterQuery.slice(0, -5); //remove the last AND
		filterQuery = filterQuery += "&rows=1000";
		return this.setQuery(filterQuery);
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
