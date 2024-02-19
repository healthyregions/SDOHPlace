
/**
 * ISSUE 75
 * Note that this interface use Aardvark's attribute name instead of raw Solr's attribute name
 * Required attributes in SolrObject are also required here
 */
export interface SolrParent {
  id: string;
  title: string;
  creator: string[];
  description: string;
  years: Set<string>; // use Set instead of array to avoid duplicate years, change this back to array if we want to see duplicate years
  metadata_version: string;
  modified: string;
  access_rights: string;
  resource_class: string;
  meta: {};
}
