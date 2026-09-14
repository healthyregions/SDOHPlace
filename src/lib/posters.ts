import postersData from "../../meta/posters.json";

export const posters = postersData.posters;

export type PostersContent = {
  readonly title: string;
  readonly author: string;
  readonly institution: string;
  readonly year: string;
  readonly link: string;
  readonly tags: string[];
  readonly image: string;
};
