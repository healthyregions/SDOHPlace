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
