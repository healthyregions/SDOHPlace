import { SolrObject } from "../interface/SolrObject";
import { SolrParent } from "../interface/SolrParent";
import { findFirstSentence} from "./util";

/**
 * Match between Aardvark and our Solr metadata,
 * except the required fields, which are defined in the SolrObject interface
 */
export const rawSolrMetdataSwitch = {
	dct_language_sm: "language",
	gbl_resourceType_sm: "resource_type",
	dct_subject_sm: "subject",
	dcat_theme_sm: "theme",
	dct_issued_s: "date_issued",
	gbl_indexYear_im: "index_year",
	dct_isVersionOf_sm: "is_version_of",
	gbl_suppressed_b: "suppressed",
	_version_: "version",
	dct_format_s: "format",
	dct_creator_sm: "creator",
	dct_publisher_sm: "publisher",
	dct_references_s: "references",
	dct_description_sm: "description",
	dct_temporal_sm: "temporal_coverage",
	gbl_displayNote_sm: "display_note",
	dct_rights_sm: "rights",
	// Following are in our object but not in Aardvark
	sdoh_spatial_resolution_sm: "spatial_resolution", // spatial coverage?
	timestamp: "timestamp",
	score: "score",
	schema_provider_s: "schema_provider",
	sdoh_methods_variables_sm: "sdoh_methods_variables",
	sdoh_data_variables_sm: "sdoh_data_variables",
	locn_geometry: "location_geometry",
};

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
			result.meta[rawSolrMetdataSwitch[key]] = rawSolrObject[key];
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
			solrParent.title = parentObject.title;
			solrParent.creator = parentObject.meta["creator"]
				? parentObject.meta["creator"][0]
				: undefined;
			solrParent.description = parentObject.meta["description"]
				? findFirstSentence(parentObject.meta["description"][0])
				: undefined;
			solrParent.years = new Set([]);
			result.push(solrParent);
		});
	solrObjects
		.filter((solrObject) => solrObject.parents)
		.forEach((childObject) => {
			childObject.parents.forEach((parentTitle) => {
				result
					.filter((solrParent) => parentTitle === solrParent.id)
					.forEach((solrParent) => {
						solrParent.years.add(childObject.meta["date_issued"]);
					});
			});
		});

	return result;
};

export { initSolrObject, generateSolrParentList };
