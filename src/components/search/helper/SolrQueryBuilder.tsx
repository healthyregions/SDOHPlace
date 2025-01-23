import { initSolrObject } from "meta/helper/solrObjects";
import { SolrObject } from "meta/interface/SolrObject";
import { findSolrAttribute } from "meta/helper/util";
import SRMatch from "../../search/helper/SpatialResolutionMatch.json";
import { adaptiveScoreFilter, scoreConfig } from "./FilterByScore";

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
  setEnvelopeQuery(bbox: number[]): string {
    const encodingPart = encodeURIComponent(`Intersects(ENVELOPE`);
    return (
      `locn_geometry:"` +
      encodingPart +
      `(${bbox[0]},${bbox[2]},${bbox[3]},${bbox[1]}))"`
    );
  }

  public fetchResult(
    signal?: AbortSignal
  ): Promise<{ results: SolrObject[]; spellCheckSuggestion?: string }> {
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
          Authorization: "Basic " + btoa(`${process.env.SOLR_USERNAME}:${process.env.SOLR_PASSWORD}`),
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
            if (jsonResponse && jsonResponse["suggest"]) {
              resolve(jsonResponse);
              return;
            }
            if (!result || result.length === 0) {
              const spellcheck =
                jsonResponse["spellcheck"]?.suggestions[1]?.suggestion;
              if (spellcheck) {
                resolve({
                  results: result,
                  spellCheckSuggestion: spellcheck[0],
                });
                return;
              }
            }
            resolve({ results: result });
          } catch (error) {
            console.error("Response parsing error:", error);
            if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
              resolve({ results: [] });
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
    if (response_json && response_json["suggest"]) return response_json;
    const q =
      response_json &&
      response_json["responseHeader"] &&
      response_json["responseHeader"].params.q;
    const rawSolrObjects =
      response_json &&
      response_json["response"] &&
      response_json["response"].docs
        ? response_json["response"].docs
        : [];
    rawSolrObjects.forEach((rawSolrObject: any) => {
      if (response_json && response_json["highlighting"] && rawSolrObject.id) {
        const highlighting = response_json["highlighting"][rawSolrObject.id];
        if (highlighting) {
          rawSolrObject.highlights = [] as string[];
          Object.values(highlighting).forEach((arrayValue: any) => {
            arrayValue.forEach((value: any) => {
              if (value) {
                rawSolrObject.highlights.push(value);
              }
            });
          });
          rawSolrObject.highlights = [
            ...Array.from(new Set(rawSolrObject.highlights)),
          ];
        }
      }
      if (q) {
        rawSolrObject.q = q;
      }
      if (q.includes("*") || rawSolrObject.score >= 1) {
        result.push(initSolrObject(rawSolrObject, this.query.schema_json));
      }
    });
    if (!q.includes("*") && result.length > 0) {
      result = adaptiveScoreFilter(
        result,
        scoreConfig.minResults || 1,
        scoreConfig?.maxResults || 10
      );
    }
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
        if (term.attribute !== "bbox")
          filterQuery += `${encodeURIComponent(
            findSolrAttribute(term.attribute, this.query.schema_json)
          )}:"${encodeURIComponent(term.value)}" AND `;
      });
    if (
      searchTerms.filter((term) => term.attribute === "bbox" && term.value) &&
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

  public combineQueries = (
    term: string,
    filterQueries: Array<any>,
    sortBy?: string,
    sortOrder?: string
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
        const bboxFilter = filterQueries.find((f) => f.attribute === "bbox");
        if (
          bboxFilter &&
          Array.isArray(bboxFilter.value) &&
          bboxFilter.value.length === 4
        ) {
          filterQuery = `&fq=${this.setEnvelopeQuery(bboxFilter.value)}`;
        }
        const otherFilters = filterQueries.filter(
          (f) =>
            f.attribute !== "vis_lyrs" &&
            f.attribute !== "query" &&
            f.attribute !== "bbox"
        );
        if (otherFilters.length > 0) {
          if (filterQuery) filterQuery += " AND ";
          else filterQuery = "&fq=";
          // Process filters in order of appearance to main the correct 'AND/OR' relation
          const processedAttributes = new Set();
          const groupedFilters = otherFilters.reduce((acc, filter) => {
            if (filter.value == null) return acc;
            const attr = findSolrAttribute(
              filter.attribute,
              this.query.schema_json
            );
            if (!processedAttributes.has(attr)) {
              const sameAttrFilters = otherFilters
                .filter(
                  (f) =>
                    f.value != null &&
                    findSolrAttribute(f.attribute, this.query.schema_json) ===
                      attr
                )
                .map((f) => {
                  const value =
                    f.attribute === "spatial_resolution"
                      ? SRMatch[f.value]
                      : f.value;
                  return `${encodeURIComponent(attr)}:"${encodeURIComponent(
                    String(value)
                  )}"`;
                });
              processedAttributes.add(attr);
              if (sameAttrFilters.length > 1) {
                acc.push(`(${sameAttrFilters.join(" OR ")})`);
              } else {
                acc.push(sameAttrFilters[0]);
              }
            }
            return acc;
          }, []);
          if (groupedFilters.length > 0) {
            filterQuery += groupedFilters.join(" AND ");
          }
        }
        if (filterQuery) {
          baseQuery += filterQuery;
        }
      }
      if (sortBy && sortOrder) {
        baseQuery += `&sort=${encodeURIComponent(
          findSolrAttribute(sortBy, this.query.schema_json)
        )}+${sortOrder}`;
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
