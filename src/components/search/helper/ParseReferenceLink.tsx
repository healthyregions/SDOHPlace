

export const ParseReferenceLink = (value: any): {
  homepageUrl?: string,
  downloadUrl?: string,
  dataDictionaryUrl?: string,
  archiveUrl?: string,
} => {
  if (!value) {
    return {};
  }
  const parsedValue = typeof value === "string" ? JSON.parse(value) : {};
  const links = {
    homepageUrl: parsedValue["http://schema.org/url"],
    downloadUrl: parsedValue["http://schema.org/downloadUrl"],
    dataDictionaryUrl: parsedValue["http://lccn.loc.gov/sh85035852"],
    archiveUrl: parsedValue["archive-url"],
  }
  return links
};
