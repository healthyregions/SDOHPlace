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
  const matchResult = typeof paragraph === 'string' && paragraph.match(sentenceMatch);
  return matchResult ? matchResult[0].trim() : undefined;
}