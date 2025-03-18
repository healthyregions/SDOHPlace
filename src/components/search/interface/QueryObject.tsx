/**
 * Interface for a Solr query object
 * Defines the properties of a Solr query object
 *
 */
interface QueryObject {
  solrUrl: string;
  query: string;
  sort?: string[];
  schema_json: {};
}
