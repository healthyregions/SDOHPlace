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
	return matchResult ? matchResult[0].trim() : undefined;
}

/**
 * Find the matched key name for metadata field of the SolrObject
 * @param rawSolrKey: raw key passed from solr
 * @param aardvark_json: the aardvark schema
 * @param sdoh_json: the sdoh schema
 * @returns: the key that matches the aardvark or sdoh schema (aardvark first), otherwise return the raw key
 */
export function AardvarkSdohSchemaMatch(
	rawSolrKey: string,
	aardvark_json: {},
	sdoh_json: {}
): string {
	let result = Object.keys(aardvark_json).find(
		(aardvarkKey: string) => aardvark_json[aardvarkKey].uri === rawSolrKey
	);
	if (result) {
		return result;
	} else {
		result = Object.keys(sdoh_json).find(
			(sdohKey: string) => sdoh_json[sdohKey].uri === rawSolrKey
		);
	}
	if (result) {
		return result;
	} else return rawSolrKey;
}

/**
 * Opposite of AardvarkSdohSchemaMatch
 * @param json_key the key to be found in the aardvark or sdoh schema
 * @param aardvark_json 
 * @param sdoh_json 
 * @returns the raw attribute name that should be put to solr query
 */
export function findSolrAttribute(json_key: string, aardvark_json: {}, sdoh_json: {}): string {
		return Object.keys(aardvark_json).find((e) => e === json_key)
			? aardvark_json[json_key]["uri"]
			: Object.keys(sdoh_json).find((e) => e === json_key)
			? sdoh_json[json_key]["uri"]
			: json_key;
	}