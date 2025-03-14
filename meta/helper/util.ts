/**
 *
 * @param paragraph
 * @returns the first sentence of the description
 */
export function findFirstSentence(paragraph: string): string | undefined {
  if (!paragraph) {
    return undefined;
  }
  const sentenceMatch = /[A-Z][^.!?]*[.!?]/;
  const matchResult =
    typeof paragraph === "string" && paragraph.match(sentenceMatch);

  return matchResult && matchResult[0] ? matchResult[0].trim() : undefined;
}

/**
 * Find the matched key name for metadata field of the SolrObject
 * @param rawSolrKey: raw key passed from solr
 * @returns: the key that matches the metadata in the schema folder, otherwise return the raw key
 */
export function schemaMatch(rawSolrKey: string, schema_json: {}): string {
  let result = schema_json["fields"].find(
    (item: object) => item["uri"] === rawSolrKey
  );
  if (result) {
    return result.id;
  } else return rawSolrKey;
}

/**
 * Opposite of schemaMatch
 * @param json_key the key to be found in the schema folder
 * @returns the raw attribute name that should be put to solr query
 */
export function findSolrAttribute(json_key: string, schema_json: {}): string {
  if (json_key === "layer") json_key = "spatial-resolution"; // layer is used in URL instead of spatial_resolution
  return schema_json["fields"].find((e) => e["id"] === json_key)
    ? schema_json["fields"].find((e) => e["id"] === json_key)["uri"]
    : json_key;
}
