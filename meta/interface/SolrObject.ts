/**
 * ISSUE 74: Take raw solr object and re-structure it to be more readable
 * Principle: all required attributes of Aardvark are first level attributes; all other attributes are nested under meta
 *
 * Structure:
 * {
 * "id": "123",
 * "title": "dct_title_s",
 * "id", "modified",...
 * "meta":
 *  {
 *  ALL OTHER FIELDS since we don't know what need to be used for now
 * }
 * }
 */
export interface SolrObject {
  id: string;
  title: string;
  creator: string[];
  description: string;
  index_year: string[]; //this is the year attribute of the original SolrObject
  metadata_version: string;
  modified: string;
  access_rights: string[];
  resource_class: string[];
  meta: { [key: string]: string | string[] };
  years: Set<string>;
  parents?: string[];
}
