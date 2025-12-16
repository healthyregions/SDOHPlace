import news_tags from "../../meta/tags_news.yml";
import showcase_tags from "../../meta/tags_showcase.yml";


export type TagContent = {
  readonly slug: string;
  readonly name: string;
};

const newsTagMap: { [key: string]: TagContent } = generateNewsTagMap();

function generateNewsTagMap(): { [key: string]: TagContent } {
  let result: { [key: string]: TagContent } = {};
  for (const tag of news_tags.tags) {
    result[tag.slug] = tag;
  }
  return result;
}

export function getNewsTag(slug: string) {
  return newsTagMap[slug];
}

export function listNewsTags(): TagContent[] {
  return news_tags.tags;
}


const showcaseTagMap: { [key: string]: TagContent } = generateShowcaseTagMap();

function generateShowcaseTagMap(): { [key: string]: TagContent } {
  let result: { [key: string]: TagContent } = {};
  for (const tag of showcase_tags.tags) {
    result[tag.slug] = tag;
  }
  return result;
}

export function getShowcaseTag(slug: string) {
  return showcaseTagMap[slug];
}

export function listShowcaseTags(): TagContent[] {
  return showcase_tags.tags;
}
