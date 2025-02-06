export interface ActionConfig {
  param: string;
  syncWithUrl: boolean;
  requiresFetch: boolean;
  isFilter: boolean;
  transform?: {
    toUrl: (value: any) => string;
    fromUrl: (value: string) => any;
  };
}

export const actionConfig: Record<string, ActionConfig> = {
  /**
   * For actions that needs to read/write to URL and trigger fetch
   */
  "search/setQuery": {
    param: "query",
    syncWithUrl: true,
    requiresFetch: true,
    isFilter: false,
  },
  "search/setSpatialResolution": {
    param: "spatial_resolution",
    syncWithUrl: true,
    requiresFetch: true,
    isFilter: true,
    transform: {
      toUrl: (value: string[]) => value.join(","),
      fromUrl: (value: string) => value.split(",").filter(Boolean),
    },
  },
  "search/setSubject": {
    param: "subject",
    syncWithUrl: true,
    requiresFetch: true,
    isFilter: true,
    transform: {
      toUrl: (value: string[]) => value.join(","),
      fromUrl: (value: string) => value.split(",").filter(Boolean),
    },
  },
  "search/setBbox": {
    param: "bbox",
    syncWithUrl: true,
    requiresFetch: false,
    isFilter: true,
    transform: {
      toUrl: (value: number[]) => value.join(","),
      fromUrl: (value: string) => value.split(",").map(Number),
    },
  },
  "search/setIndexYear": {
    param: "index_year",
    syncWithUrl: true,
    requiresFetch: true,
    isFilter: true,
    transform: {
      toUrl: (value: number[]) => {
        const min = Math.min(...value);
        const max = Math.max(...value);
        return `${min}-${max}`;
      },
      fromUrl: (value: string) => {
        const [start, end] = value.split("-").map(Number); // use dash in url
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      },
    },
  },
  /**
   * For actions that needs to read/write to URL but not trigger fetch
   */
  "ui/setShowDetailPanel": {
    param: "show",
    syncWithUrl: true,
    requiresFetch: false,
    isFilter: false,
    transform: {
      toUrl: (value: string) => value,
      fromUrl: (value: string) => value,
    },
  },
  "search/setAISearch": {
    param: "ai_search",
    syncWithUrl: true,
    requiresFetch: false,
    isFilter: false,
    transform: {
      toUrl: (value: boolean) => value.toString(),
      fromUrl: (value: string) => value === "true",
    },
  },

  /**
   * For actions that needs to trigger fetch but not read/write to URL
   */
  "search/setSchema": {
    param: "schema",
    syncWithUrl: false,
    requiresFetch: true,
    isFilter: false,
  },
  "search/setSortBy": {
    param: "sortBy",
    syncWithUrl: false,
    requiresFetch: true,
    isFilter: false,
  },
  "search/setSortOrder": {
    param: "sortOrder",
    syncWithUrl: false,
    requiresFetch: true,
    isFilter: false,
  },

  /**
   * For actions that needs to read/write to URL but not trigger fetch.
   * This will be handled on the UI side only. Here is just to show the configuration.
   */
  "ui/showFilter": {
    param: "showFilter",
    syncWithUrl: false,
    requiresFetch: false,
    isFilter: false,
  },
};
