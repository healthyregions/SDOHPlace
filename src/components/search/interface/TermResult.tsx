export default interface TermResult {
  responseHeader: {
    status: number;
    QTime: number;
  };
  suggest: {
    [key: string]: {
      // This is a placeholder. The actual key is the name of the suggester
      [key: string]: {
        numFound: number;
        suggestions: {
          term: string;
          weight: number;
          payload: string;
        }[];
      };
    };
  };
}
