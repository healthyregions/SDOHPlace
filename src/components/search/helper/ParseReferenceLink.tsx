export const ParseReferenceLink = (value: any) => {
  const parsedValue = typeof value === "string" ? JSON.parse(value) : value;
  if (typeof parsedValue !== "object" || parsedValue === null) {
    throw new Error(
      "Invalid value: must be a JSON object or a JSON string representing an object"
    );
  }
  const [key, url] = Object.entries(parsedValue)[0];
  return [key, url];
}