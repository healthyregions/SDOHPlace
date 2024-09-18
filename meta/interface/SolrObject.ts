/**
 * Principle: all required attributes of Aardvark are first level attributes;
 * All other attributes are nested under meta with clear type definition and additional attributes are added as needed.
 * Note that not all attributes in metadata managers are here. Only ones returned by search results are included.
 */
export interface SolrObject {
  id: string;
  title: string;
  creator: string[];
  description: string;
  index_year: string[];
  metadata_version: string;
  modified: string;
  access_rights: string[];
  resource_class: string[];
  score: number; // Solr score to define relevance
  meta: {
    access_rights?: string;
    language?: string;
    publisher?: string;
    provider?: string;
    resource_type?: string;
    subject?: string;
    theme?: string;
    issued?: string;
    temporal?: string;
    references?: any; // json object. Value should be displayed
    rights?: string;
    md_modified?: string;
    md_version?: string;
    suppress?: boolean;
    spatial_resolution?: string[];
    spatial_coverage?: string[];
    data_usage_notes?: string;
    data_variables?: string[];
    methods_variables?: string[];
    version?: string;
    timestamp?: string;
    score?: number;
    display_note?: string[];
  };
  years: Set<string>;
  parents?: string[];
}
