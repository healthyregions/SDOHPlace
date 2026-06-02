export type GuideUpdatedDateSource = {
  readonly last_updated: string;
};

export function getGuideUpdatedDate(item: GuideUpdatedDateSource): Date {
  return new Date(item.last_updated);
}
