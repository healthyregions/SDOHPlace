import fellowsData from "../../meta/fellows.json";

const fellows = fellowsData.fellows;

export type FellowContent = {
  readonly name: string;
  readonly title: string;
  readonly link: string;
  readonly image: string;
};

const fellowMap: { [key: string]: FellowContent } = generateFellowMap();

function generateFellowMap(): { [key: string]: FellowContent } {
  let result: { [key: string]: FellowContent } = {};
  for (const fellow of fellowsData.fellows) {
    const link = fellow.links.length > 0 ? fellow.links[0].link_url : "";

    result[fellow.name] = {
      name: fellow.name,
      title: fellow.title,
      link: link,
      image: fellow.image,
    };
  }
  return result;
}

export function getFellow(name: string) {
  return fellowMap[name];
}
