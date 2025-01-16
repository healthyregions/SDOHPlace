import { SolrObject } from "../interface/SolrObject";
// import { SolrParent } from "../interface/SolrParent";
import { schemaMatch } from "./util";

/**
 *
 * @param rawSolrObject
 * @param matchingRule
 * @returns
 */
const initSolrObject = (rawSolrObject: any, schema: {}): SolrObject => {
  let result = {} as SolrObject;
  result.score = rawSolrObject.score;
  result.id = rawSolrObject.id;
  result.title = rawSolrObject.dct_title_s;
  result.metadata_version = rawSolrObject.gbl_mdVersion_s;
  result.modified = rawSolrObject.gbl_mdModified_dt;
  result.access_rights = rawSolrObject.dct_accessRights_s;
  result.resource_class = rawSolrObject.gbl_resourceClass_sm;
  result.description = rawSolrObject.dct_description_sm
    ? rawSolrObject.dct_description_sm
    : [];
  result.creator = rawSolrObject.dct_creator_sm
    ? typeof rawSolrObject.dct_creator_sm === "string"
      ? [rawSolrObject.dct_creator_sm]
      : rawSolrObject.dct_creator_sm
    : [];
  result.index_year = rawSolrObject.gbl_indexYear_im
    ? typeof rawSolrObject.gbl_indexYear_im === "string"
      ? [rawSolrObject.gbl_indexYear_im]
      : rawSolrObject.gbl_indexYear_im.map((year) => {
          return year.toString();
        })
    : [];
  result.highlights = rawSolrObject.highlights ? rawSolrObject.highlights : [];
  result.meta = {};
  result.years = [];
  if (rawSolrObject.dct_isVersionOf_sm)
    // child object only
    result.parents = rawSolrObject.dct_isVersionOf_sm;
  Object.keys(rawSolrObject).forEach((key) => {
    if (
      key !== "id" &&
      key !== "dct_title_s" &&
      key !== "gbl_mdVersion_s" &&
      key !== "gbl_mdModified_dt" &&
      key !== "dct_accessRights_s" &&
      key !== "gbl_resourceClass_sm" &&
      key !== "dct_description_sm" &&
      key !== "dct_creator_sm" &&
      key !== "gbl_indexYear_im" &&
      key !== "dct_isVersionOf_sm"
    ) {
      result.meta[schemaMatch(key, schema)] = rawSolrObject[key];
    }
  });
  result.q = rawSolrObject.q;
  return result;
};

/**
 * Creator and description are returned as the first value of the array
 * @param solrObjects a list of transformed solr objects using initSolrObject
 * @returns a list of solrParent objects to create parent resource list
 */
const generateSolrObjectList = (solrObjects: SolrObject[]): SolrObject[] => {
  solrObjects = solrObjects.filter((solrObject) => solrObject !== undefined);
  let result = new Set<SolrObject>(solrObjects);
  return Array.from(result);
};

/**
 * Use this function to derive the parent object from a list of solr objects.
 * Note this is not equal to generateSolrObjectList, thus won't have 'years' accumulated from child object.
 *
 * This function should be called to derive the parent result from Solr response.
 */
const filterParentList = (solrObjects: SolrObject[]): SolrObject[] => {
  return solrObjects.filter((solrObject) => !solrObject.parents);
};

export { initSolrObject, generateSolrObjectList, filterParentList };
