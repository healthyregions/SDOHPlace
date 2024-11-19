import { initSolrObject } from "meta/helper/solrObjects";
import { SolrObject } from "meta/interface/SolrObject";
import { findSolrAttribute } from "meta/helper/util";
import SRMatch from "../../search/helper/SpatialResolutionMatch.json";

export default class SolrQueryBuilder {
  private query: QueryObject = {
    solrUrl: process.env.NEXT_PUBLIC_SOLR_URL || "",
    query: "",
    schema_json: {},
  };

  // Method to set the basic query string. Don't call this. Call individual query methods instead.
  // TODO: if our query will have more syntax, move the select part to individual query methods
  setQuery(queryString: string): SolrQueryBuilder {
    this.query.query = `${this.query.solrUrl}/${queryString}`;
    return this;
  }
  getQuery(): string {
    return this.query.query;
  }
  getSchema(): {} {
    return this.query.schema_json;
  }
  getSolrUrl(): string {
    return this.query.solrUrl;
  }
  setSchema(schema: {}): SolrQueryBuilder {
    this.query.schema_json = schema;
    return this;
  }
  setEnvelopeQuery(bbox: any): string {
    const encodingPart = encodeURIComponent(`Intersects(ENVELOPE`);
    return (
      `locn_geometry:"` +
      encodingPart +
      `(${bbox[0]},${bbox[2]},${bbox[3]},${bbox[1]}))"`
    );
  }

  public fetchResult(signal?: AbortSignal): Promise<SolrObject[]> {
    return new Promise((resolve, reject) => {
      const currentUrl = this.query.query;
      console.log("Attempting to fetch URL:", currentUrl);
      if (!currentUrl || !this.query.solrUrl) {
        console.error("Invalid URL configuration:", {
          currentUrl,
          solrUrl: this.query.solrUrl,
        });
        reject(new Error("Invalid URL configuration"));
        return;
      }
      try {
        new URL(currentUrl);
      } catch (error) {
        console.error("URL Construction Error:", {
          url: currentUrl,
          error: error.message,
        });
        reject(new Error(`Invalid URL: ${currentUrl}`));
        return;
      }
      fetch(currentUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        signal,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.text();
        })
        .then((text) => {
          try {
            const jsonResponse = JSON.parse(text);
            const result = this.getSearchResult(jsonResponse);
            resolve(result);
          } catch (error) {
            console.error("Response parsing error:", error);
            if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
              resolve([]);
            } else {
              reject(new Error("Invalid response format"));
            }
          }
        })
        .catch((error) => {
          console.error("Fetch error:", {
            name: error.name,
            message: error.message,
            url: currentUrl,
          });
          reject(error);
        });
    });
  }
  /**
   * Based on the response from solr, return a list of SolrObjects as the search result.
   * @param response_json object of the response from solr
   * @returns a list of SolrObjects as the search result. If no result, return empty list.
   */
  getSearchResult(response_json: any): any {
    let result = [] as SolrObject[];
    //if return suggest
    if (response_json && response_json["suggest"]) return response_json;
    //if return select
    const rawSolrObjects =
      response_json &&
      response_json["response"] &&
      response_json["response"].docs
        ? response_json["response"].docs
        : [];
    rawSolrObjects.forEach((rawSolrObject: any) => {
      result.push(initSolrObject(rawSolrObject, this.query.schema_json));
    });
    return result;
  }

  /**
   * Search Methods based on Solr syntax. Not all methods are used in the search component
   * */
  public suggestQuery(searchTerm: string): SolrQueryBuilder {
    const suggestQuery = `suggest?q=${encodeURIComponent(
      searchTerm
    )}&fq=-gbl_suppressed_b:true`;
    return this.setQuery(suggestQuery);
  }
  public contentQuery(searchTerm: string): SolrQueryBuilder {
    const contentQuery = `select?q=content:"${encodeURIComponent(searchTerm)}"`;
    return this.setQuery(contentQuery);
  }
  public generalQuery(searchTerms: string | string[]): SolrQueryBuilder {
    let generalQuery = "select?q=";
    if (searchTerms && searchTerms !== "*") {
      if (typeof searchTerms === "string") {
        const solrAttr = findSolrAttribute(searchTerms, this.query.schema_json);
        generalQuery += encodeURIComponent(solrAttr);
      } else if (Array.isArray(searchTerms)) {
        const terms = searchTerms
          .filter((term) => term)
          .map((term) =>
            encodeURIComponent(findSolrAttribute(term, this.query.schema_json))
          );

        if (terms.length > 0) {
          generalQuery += terms.join(" OR ");
        } else {
          generalQuery += "*:*";
        }
      }
    } else {
      generalQuery += "*:*";
    }
    generalQuery += "&fq=(gbl_suppressed_b:false)&rows=1000";
    return this.setQuery(generalQuery);
  }

  public filterQuery(
    searchTerms: { attribute: string; value: any }[]
  ): SolrQueryBuilder {
    let filterQuery = `select?fq=`;
    if (searchTerms)
      searchTerms.forEach((term) => {
        if (term.attribute !== "bbox" && term.attribute !== "bboxSearch")
          filterQuery += `${encodeURIComponent(
            findSolrAttribute(term.attribute, this.query.schema_json)
          )}:"${encodeURIComponent(term.value)}" AND `;
      });
    if (
      searchTerms.filter(
        (term) => term.attribute === "bboxSearch" && term.value === true
      ) &&
      searchTerms.filter((term) => term.attribute === "bbox").length > 0
    ) {
      const bbox = searchTerms.filter((term) => term.attribute === "bbox")[0]
        .value;
      filterQuery += this.setEnvelopeQuery(bbox) + " AND ";
    }
    filterQuery = filterQuery.slice(0, -5); //remove the last AND
    filterQuery = filterQuery += "&fq=(gbl_suppressed_b:false)&rows=1000";
    return this.setQuery(filterQuery);
  }

  public sortQuery(searchTerm: {
    attribute: string;
    order: string;
  }): SolrQueryBuilder {
    if (searchTerm.order != "asc" && searchTerm.order != "desc") {
      searchTerm.order = "asc";
    } //use asc as default
    let sortQuery = `select?sort=${encodeURIComponent(
      findSolrAttribute(searchTerm.attribute, this.query.schema_json)
    )}${encodeURIComponent(" ")}${searchTerm.order}`;
    sortQuery = sortQuery; //add rows to remove pagination
    return this.setQuery(sortQuery);
  }

  public combineQueries = (
    term: string,
    filterQueries: Array<any>
  ): SolrQueryBuilder => {
    if (!this.query.solrUrl) {
      console.error("Missing SOLR_URL configuration");
      return this.setQuery(
        "select?q=*:*&fq=(gbl_suppressed_b:false)&rows=1000"
      );
    }
    try {
      const safeTerm = term || "*";
      let baseQuery = this.generalQuery(safeTerm).getQuery();
      if (Array.isArray(filterQueries) && filterQueries.length > 0) {
        let filterQuery = "";
        const bboxFilter =
          filterQueries.find((f) => f.attribute === "bbox")
          ;
        if (
          filterQueries.find(
            (f) => f.attribute === "bboxSearch" && f.value === true
          ) &&
          bboxFilter &&
          Array.isArray(bboxFilter.value) &&
          bboxFilter.value.length === 4
        ) {
          filterQuery = `&fq=${this.setEnvelopeQuery(bboxFilter.value)}`;
        }
        const otherFilters = filterQueries.filter(
          (f) =>
            f.attribute !== "layers" &&
            f.attribute !== "query" &&
            f.attribute !== "bboxSearch" &&
            f.attribute !== "bbox"
        );

        if (otherFilters.length > 0) {
          if (filterQuery) filterQuery += " AND ";
          else filterQuery = "&fq=";
          const validFilters = otherFilters
            .filter((f) => f.value != null)
            .map((f) => {
              const value =
                f.attribute === "spatial_resolution"
                  ? SRMatch[f.value]
                  : f.value;
              const attr = findSolrAttribute(
                f.attribute,
                this.query.schema_json
              );
              return `${encodeURIComponent(attr)}:"${encodeURIComponent(
                String(value)
              )}"`;
            })
            .filter(Boolean);
          if (validFilters.length > 0) {
            filterQuery += validFilters.join(" AND ");
          }
        }
        if (filterQuery) {
          baseQuery += filterQuery;
        }
      }
      const cleanQuery = baseQuery.replace(/([^:])\/\//g, "$1/");
      return this.setQuery(
        cleanQuery.replace(this.query.solrUrl, "").replace(/^\//, "")
      );
    } catch (error) {
      console.error("Error in combineQueries:", error);
      return this.setQuery(
        "select?q=*:*&fq=(gbl_suppressed_b:false)&rows=1000"
      );
    }
  };
}
