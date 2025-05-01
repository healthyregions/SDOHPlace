import { SolrObject } from "meta/interface/SolrObject";

interface ScoreFilterConfig {
  minResults: number;
  maxResults: number;
  dropThreshold: number;
  minimumScore: number;
}

export const scoreConfig: ScoreFilterConfig = {
  minResults: 5,
  maxResults: 10,
  dropThreshold: 1.5,
  minimumScore: 1,
};

export function adaptiveScoreFilter(
  docs: SolrObject[],
  minResults: number = scoreConfig.minResults,
  maxResults: number = scoreConfig.maxResults
): SolrObject[] {
  if (docs.length <= minResults) return docs;

  const scores = docs.map((doc) => doc.score);
  const scoreDrops = [];
  for (let i = 1; i < scores.length; i++) {
    scoreDrops.push((scores[i - 1] - scores[i]) / scores[i - 1]);
  }
  const initialDrops = scoreDrops.slice(0, minResults - 1);
  const avgInitialDrop =
    initialDrops.length > 0
      ? initialDrops.reduce((a, b) => a + b, 0) / initialDrops.length
      : 0;
  let cutoffIndex = minResults;
  for (
    let i = minResults - 1;
    i < Math.min(scores.length - 1, maxResults - 1);
    i++
  ) {
    if (scoreDrops[i] > avgInitialDrop * 2.0) {
      cutoffIndex = i + 1;
      break;
    }
  }
  return docs.slice(0, cutoffIndex);
}

export function getScoreExplanation(
  q: string,
  spellcheck: string,
  currentQuery: string,
  score: number,
  avgScore: number,
  maxScore: number
): string {
  if (!q || q === "*" || currentQuery === "*") return;
  if (!spellcheck && 
    (q === currentQuery
    || q.toLowerCase().includes(currentQuery.toLowerCase())
    || currentQuery.toLowerCase().includes(q.toLowerCase())
  )) {
    q = q
      .replace(/,/g, '"')
      .replace(/"/g, " ")
      ;
    if (score > maxScore * 0.9) {
      return `This is a <b>strong</b> match for <b>${q}</b> in important fields like title and description.`;
    }
    if (score > avgScore) {
      return `This is a <b>good</b> match for <b>${q}</b> that contains your search terms across multiple fields.`;
    }
    if (score == avgScore) {
      return `This is a <b>moderate</b> match for <b>${q}</b>.`;
    }
    return `This is a <b>broad</b> match for <b>${q}</b>.`;
  }
  else{
    if (score > maxScore * 0.9) {
      return `While <i>${q}</i> may not visibly include <b>${currentQuery}</b>, it closely aligns with its meaning or intent, and is therefore shown as a <strong>strong</strong> match.`;
    }
    if (score > avgScore) {
      return `While <i>${q}</i> may not visibly include <b>${currentQuery}</b>, it somewhat aligns with its meaning or intent, and is therefore shown as a <strong>good</strong> match.`;
    }
    return `While <i>${q}</i> may not visibly include <b>${currentQuery}</b>, it may aligns with its meaning or intent, and is therefore shown as a <strong>broad</strong> match.`;
  }
}
