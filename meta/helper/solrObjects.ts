import { SolrObject } from "../interface/SolrObject";
// import { SolrParent } from "../interface/SolrParent";
import { findFirstSentence, schemaMatch } from "./util";

/**
 *
 * @param rawSolrObject
 * @param matchingRule
 * @returns
 */
const initSolrObject = (rawSolrObject: any, schema: {}): SolrObject => {
  let result = {} as SolrObject;
  result.id = rawSolrObject.id;
  result.title = rawSolrObject.dct_title_s;
  result.metadata_version = rawSolrObject.gbl_mdVersion_s;
  result.modified = rawSolrObject.gbl_mdModified_dt;
  result.access_rights = rawSolrObject.dct_accessRights_s;
  result.resource_class = rawSolrObject.gbl_resourceClass_sm;
  result.description = rawSolrObject.dct_description_sm
    ? findFirstSentence(rawSolrObject.dct_description_sm[0])
    : "";
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
  result.meta = {
    
  };
  result.years = new Set();
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
  return result;
};

/**
 * Creator and description are returned as the first value of the array
 * @param solrObjects a list of transformed solr objects using initSolrObject
 * @returns a list of solrParent objects to create parent resource list
 */
const generateSolrParentList = (solrObjects: SolrObject[]): SolrObject[] => {
  let result = new Set<SolrObject>();
  solrObjects
    .filter((solrObject) => solrObject.parents)
    .forEach((childObject) => {
      childObject.parents.forEach((parentTitle) => {
        solrObjects
          .filter((solrParent) => parentTitle === solrParent.id)
          .forEach((solrParent) => {
            childObject.meta["date_issued"]
              ? solrParent.years.add(
                  typeof childObject.meta["date_issued"] === "string"
                    ? childObject.meta["date_issued"]
                    : childObject.meta["date_issued"][0]
                )
              : null;
            result.add(solrParent);
          });
      });
    });
  solrObjects
    .filter((solrObject) => !solrObject.parents)
    .forEach((solrObject) => {
      result.add(solrObject);
    });
  return Array.from(result);
};

/**
 * Use this function to derive the parent object from a list of solr objects.
 * Note this is not equal to generateSolrParentList, thus won't have 'years' accumulated from child object.
 *
 * This function should be called to derive the parent result from Solr response.
 */
const filterParentList = (solrObjects: SolrObject[]): SolrObject[] => {
  return solrObjects.filter((solrObject) => !solrObject.parents);
};

export { initSolrObject, generateSolrParentList, filterParentList };
