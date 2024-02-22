import { SolrObject } from "../interface/SolrObject";
import { SolrParent } from "../interface/SolrParent";
import aardvark_json from "../../src/pages/search/_metadata/aardvark_schema.json";
import sdoh_json from "../../src/pages/search/_metadata/sdohplace_schema.json";
import { AardvarkSdohSchemaMatch, findFirstSentence } from "./util";

/**
 *
 * @param rawSolrObject
 * @param matchingRule
 * @returns
 */
const initSolrObject = (rawSolrObject: any): SolrObject => {
	let result = {} as SolrObject;
	result.id = rawSolrObject.id;
	result.title = rawSolrObject.dct_title_s;
	result.metadata_version = rawSolrObject.gbl_mdVersion_s;
	result.modified = rawSolrObject.gbl_mdModified_dt;
	result.access_rights = rawSolrObject.gbl_mdAccessRights_s;
	result.resource_class = rawSolrObject.gbl_resourceClass_s;
	result.meta = {};
	if (rawSolrObject.dct_isVersionOf_sm)
		result.parents = rawSolrObject.dct_isVersionOf_sm;
	Object.keys(rawSolrObject).forEach((key) => {
		if (
			key !== "id" &&
			key !== "dct_title_s" &&
			key !== "gbl_mdVersion_s" &&
			key !== "gbl_mdModified_dt" &&
			key !== "gbl_mdAccessRights_s" &&
			key !== "gbl_resourceClass_s"
		) {
			result.meta[
				AardvarkSdohSchemaMatch(key, aardvark_json, sdoh_json)
			] = rawSolrObject[key];
		}
	});
	return result;
};

/**
 * Creator and description are returned as the first value of the array
 * @param solrObjects a list of transformed solr objects using initSolrObject
 * @returns a list of solrParent objects to create parent resource list
 */
const generateSolrParentList = (solrObjects: SolrObject[]): SolrParent[] => {
	let result = [] as SolrParent[];
	solrObjects
		.filter((solrObject) => !solrObject.parents)
		.forEach((parentObject) => {
			let solrParent = {} as SolrParent;
			solrParent.id = parentObject.id;
			solrParent.title = parentObject.title ? parentObject.title : "";
			solrParent.creator = parentObject.meta["creator"]
				? typeof parentObject.meta["creator"] === "string"
					? [parentObject.meta["creator"]]
					: parentObject.meta["creator"]
				: [];
			solrParent.description = parentObject.meta["description"]
				? findFirstSentence(parentObject.meta["description"][0])
				: "";
			solrParent.meta = parentObject.meta ? parentObject.meta : {};
			solrParent.metadata_version = parentObject.metadata_version
				? parentObject.metadata_version
				: "";
			solrParent.modified = parentObject.modified
				? parentObject.modified
				: "";
			solrParent.access_rights = parentObject.access_rights
				? parentObject.access_rights
				: [];
			solrParent.resource_class = parentObject.resource_class
				? parentObject.resource_class
				: [];
			solrParent.years = new Set([]);
			solrParent.year = parentObject.meta["index_year"]
				? typeof parentObject.meta["index_year"] === "string"
					? [parentObject.meta["index_year"]]
					: parentObject.meta["index_year"].map((year) => { return year.toString()})
				: [];
			result.push(solrParent);
		});
	solrObjects
		.filter((solrObject) => solrObject.parents)
		.forEach((childObject) => {
			childObject.parents.forEach((parentTitle) => {
				result
					.filter((solrParent) => parentTitle === solrParent.id)
					.forEach((solrParent) => {
						childObject.meta["date_issued"]
							? solrParent.years.add(
									typeof childObject.meta["date_issued"] ===
										"string"
										? childObject.meta["date_issued"]
										: childObject.meta["date_issued"][0]
							  )
							: null;
					});
			});
		});

	return result;
};

export { initSolrObject, generateSolrParentList };
