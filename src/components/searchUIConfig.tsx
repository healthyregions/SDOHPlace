export const SearchUIConfig = {
  search: {
    headerRow: {
      title: "Data Discovery",
      subtitle:
        "Our data discovery platform provides access to spatially indexed and curated databases,specifically designed for conducting health equity research.",
    },
    searchBox: {
      spatialResOptions: [
        {
          value: "state",
          display_name: "State",
        },
        {
          value: "county",
          display_name: "County",
        },

        {
          value: "tract",
          display_name: "Tract",
        },
        {
          value: "bg",
          display_name: "Block Group",
        },
        {
          value: "zcta",
          display_name: "Zip",
        },
      ],
    },
    searchResults: {
      resultListHeight: "60vh",
      relatedListHeight: "40vh",
    },
    searchFilters: {
      filters: [
        // {
        //   attribute: "resource_class",
        //   displayName: "Resource Class",
        //   meta: false,
        // },
        // {
        //   attribute: "resource_type",
        //   displayName: "Resource Type",
        //   meta: true,
        // },
        // {
        //   attribute: "subject",
        //   displayName: "Subject",
        // },
        // {
        //   attribute: "theme",
        //   displayName: "Theme",
        // },
        // {
        //   attribute: "creator",
        //   displayName: "Creator",
        // },
        // {
        //   attribute: "publisher",
        //   displayName: "Publisher",
        // },
        // {
        //   attribute: "provider",
        //   displayName: "Provider",
        // },
        // {
        //   attribute: "methods_variables",
        //   displayName: "Methods Variables",
        // },
        // {
        //   attribute: "data_variables",
        //   displayName: "Data Variables",
        // },
        // {
        //   attribute: "spatial_coverage",
        //   displayName: "Spatial Coverage",
        // },
        // {
        //   attribute: "spatial_resolution",
        //   displayName: "Spatial Resolution",
        // },
        {
          attribute: "index_year",
          displayName: "Index Year",
          meta: false,
        },
      ],
      filterPanelHeight: "30vh",
    },
    mapPanel: {
      title: "How to search?",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  },
};
