
import { sdohSemanticDatabase } from './semantic/SDOHSemanticDatabase';
import { basicSynonymMap } from './semantic/BasicSynonyms';
import { stopWords } from './semantic/StopWords';
import { stemmingRules, suffixRules } from './semantic/MorphologicalRules';

interface ParsedQuestion {
  keywords: string[];
  semanticGroups: Map<string, string[]>;
  allEnrichedTerms: string[];
}

export class LocalQuestionParser {
  private readonly minSemanticWeight = 0.95;

  parseQuestion(question: string): ParsedQuestion {
    const cleanQuestion = this.cleanText(question);
    const words = this.tokenize(cleanQuestion);
    const meaningfulWords = this.removeStopWords(words);
    const keywordData = this.extractKeywordsWithSemantics(meaningfulWords);
    return {
      keywords: keywordData.topKeywords,
      semanticGroups: keywordData.semanticGroups,
      allEnrichedTerms: keywordData.allEnrichedTerms
    };
  }

  generateSolrQueries(parsed: ParsedQuestion): string[] {
    const queries: string[] = [];
    const baseParams = 'fq=(gbl_suppressed_b:false)&rows=1000';
    if (parsed.keywords.length > 0) {
      const processedWords = new Set<string>();
      parsed.keywords.forEach(keyword => {
        if (!processedWords.has(keyword)) {
          const semanticGroup = parsed.semanticGroups.get(keyword);
          if (semanticGroup && semanticGroup.length > 1) {
            const singleWords = semanticGroup
              .filter(term => !term.includes(' ') && term.length >= 3);
            if (singleWords.length > 1) {
              const semanticQuery = singleWords
                .map(term => `"${term}"`)
                .join(' OR ');
              queries.push(`select?q=(${encodeURIComponent(semanticQuery)})&${baseParams}`);
            } else if (singleWords.length === 1) {
              queries.push(`select?q=${encodeURIComponent(singleWords[0])}&${baseParams}`);
            } else {
              queries.push(`select?q=${encodeURIComponent(keyword)}&${baseParams}`);
            }
            semanticGroup.forEach(term => processedWords.add(term));
          } else {
            queries.push(`select?q=${encodeURIComponent(keyword)}&${baseParams}`);
          }
          processedWords.add(keyword);
        }
      });
    }
    return queries.length > 0 ? queries : [`select?q=*:*&${baseParams}`];
  }

  private cleanText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private tokenize(text: string): string[] {
    return text.split(/\s+/).filter(word => word.length > 1);
  }

  private removeStopWords(words: string[]): string[] {
    return words.filter(word => !stopWords.has(word));
  }

  private extractKeywordsWithSemantics(words: string[]): {
    topKeywords: string[];
    semanticGroups: Map<string, string[]>;
    allEnrichedTerms: string[];
  } {
    const keywordCounts = new Map<string, number>();
    const semanticGroups = new Map<string, string[]>();
    const enrichedTerms = new Set<string>();
    words.forEach(word => {
      if (word.length >= 3) {
        keywordCounts.set(word, (keywordCounts.get(word) || 0) + 1);
        const semanticGroup: string[] = [word];
        const domainMatches = this.findDomainMatches(word);
        domainMatches.forEach(match => {
          enrichedTerms.add(match);
          keywordCounts.set(match, (keywordCounts.get(match) || 0) + 0.9);
          semanticGroup.push(match);
        });
        const wordnetMatches = this.findWordMatches(word);
        wordnetMatches.forEach(match => {
          enrichedTerms.add(match);
          keywordCounts.set(match, (keywordCounts.get(match) || 0) + 0.7);
          semanticGroup.push(match);
        });
        if (semanticGroup.length > 1) {
          semanticGroups.set(word, Array.from(new Set(semanticGroup)));
        }
      }
    });
    const combinedTerms = Array.from(keywordCounts.entries())
      .filter(([word, weight]) => weight >= this.minSemanticWeight)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word);

    return {
      topKeywords: combinedTerms,
      semanticGroups,
      allEnrichedTerms: Array.from(enrichedTerms)
    };
  }

  private findDomainMatches(word: string): string[] {
    const matches: string[] = [];
    
    for (const [domain, semanticEntry] of Array.from(sdohSemanticDatabase.entries())) {
      const allTerms = [
        domain,
        ...semanticEntry.synonyms,
        ...semanticEntry.hypernyms,
        ...semanticEntry.hyponyms,
        ...semanticEntry.related,
        ...semanticEntry.domain_terms
      ];
      for (const term of allTerms) {
        if (term === word) {
          matches.push(...semanticEntry.synonyms.slice(0, 2).filter(syn => syn !== word));
          matches.push(...semanticEntry.hypernyms.slice(0, 1).filter(hyp => hyp !== word));
          matches.push(...semanticEntry.hyponyms.slice(0, 1).filter(hyp => hyp !== word));
          matches.push(...semanticEntry.related.slice(0, 2).filter(rel => rel !== word));
          matches.push(...semanticEntry.domain_terms.slice(0, 1).filter(dt => dt !== word));
          break;
        }
      }
    }
    return Array.from(new Set(matches));
  }

  private findWordMatches(word: string): string[] {
    const matches: string[] = [];
    const stemmed = this.simpleStem(word);
    if (stemmed !== word && stemmed.length >= 3) {
      matches.push(stemmed);
    }
    const morphological = this.getMorphologicalVariants(word);
    matches.push(...morphological);
    const basicSynonyms = this.getBasicSynonyms(word);
    matches.push(...basicSynonyms);
    return Array.from(new Set(matches));
  }

  private simpleStem(word: string): string {
    word = word.toLowerCase();
    for (const rule of stemmingRules) {
      if (word.endsWith(rule.suffix) && word.length > rule.suffix.length + 2) {
        const base = word.slice(0, -rule.suffix.length) + rule.replacement;
        if (base.length >= 3) {
          return base;
        }
      }
    }
    return word;
  }

  private getMorphologicalVariants(word: string): string[] {
    const variants: string[] = [];   
    const simplePluralization = this.getSimplePlurals(word);
    variants.push(...simplePluralization);
    const commonSuffixes = this.processSuffixes(word);
    variants.push(...commonSuffixes);
    return variants;
  }

  private getSimplePlurals(word: string): string[] {
    const variants: string[] = [];
    if (word.endsWith('s') && word.length > 3) {
      variants.push(word.slice(0, -1));
    } else if (!word.endsWith('s')) {
      variants.push(word + 's');
    }
    if (word.endsWith('ies') && word.length > 4) {
      variants.push(word.slice(0, -3) + 'y');
    } else if (word.endsWith('y') && word.length > 2) {
      variants.push(word.slice(0, -1) + 'ies');
    }
    return variants.filter(v => v.length >= 3);
  }

  private processSuffixes(word: string): string[] {
    const variants: string[] = [];
    for (const rule of suffixRules) {
      if (word.endsWith(rule.suffix) && word.length > rule.suffix.length + 2) {
        const base = word.slice(0, -rule.suffix.length) + rule.base;
        if (base.length >= 3) {
          variants.push(base);
        }
      }
    }
    return variants;
  }

  private getBasicSynonyms(word: string): string[] {
    return basicSynonymMap.get(word.toLowerCase()) || [];
  }
}

export const createLocalParser = () => new LocalQuestionParser(); 