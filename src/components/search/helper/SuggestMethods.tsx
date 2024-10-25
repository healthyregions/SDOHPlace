export const isLocationTerm = (suggest) => {
  return (
    /^[A-Za-z\s.'()-]+,\s[A-Za-z\s]+$/.test(suggest.term) ||
    /^Southeast coastal Alaska$/.test(suggest.term) ||
    /^(North|South|West|East)\s[A-Za-z\s]+$/.test(suggest.term)
  );
};

export const containsYear = (suggest) => {
  return /\(\d{4}\)/.test(suggest.payload);
};
