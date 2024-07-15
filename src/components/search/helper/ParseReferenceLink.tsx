export const ParseReferenceLink = (value: any) => {
  if (!value) {
    return ["", ""];
  }
  const parsedValue = typeof value === "string" ? JSON.parse(value) : value;
  if (
    typeof parsedValue !== "object" ||
    parsedValue === null ||
    Object.entries(parsedValue).length === 0
  ) {
    return ["", ""];
  }
  const [key, url] = Object.entries(parsedValue)[0];
  return [key, url];
};
