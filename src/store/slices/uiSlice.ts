import { createSlice } from "@reduxjs/toolkit";

interface MapPreviewLyr {
  lyrId: string;
  filterIds: string[];
}

interface UIState {
  pageFirstLoad: boolean;
  showInfoPanel: boolean;
  infoPanelTab: number;
  showDetailPanel: string;
  showFilter: boolean;
  showClearButton: boolean;
  showSharedLink: boolean;
  mapPreview: MapPreviewLyr[];
  geosearchSelection: string;
}

const initialState: UIState = {
  pageFirstLoad: true,
  showInfoPanel: false,
  infoPanelTab: 0,
  showDetailPanel: "",
  showFilter: false,
  showClearButton: false,
  showSharedLink: false,
  mapPreview: [],
  geosearchSelection: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setPageFirstLoad: (state, action) => {
      state.pageFirstLoad = action.payload;
    },
    setShowInfoPanel: (state, action) => {
      state.showInfoPanel = action.payload;
    },
    setInfoPanelTab: (state, action) => {
      state.infoPanelTab = action.payload;
    },
    setShowDetailPanel: (state, action) => {
      state.showDetailPanel = action.payload;
    },
    setShowFilter: (state, action) => {
      state.showFilter = action.payload;
    },
    setShowClearButton: (state, action) => {
      state.showClearButton = action.payload;
    },
    setShowSharedLink: (state, action) => {
      state.showSharedLink = action.payload;
    },
    clearMapPreview: (state) => {
      state.mapPreview = [];
    },
    setMapPreview: (state, action) => {
      state.mapPreview = action.payload;
    },
    setGeosearchSelection: (state, action) => {
      state.geosearchSelection = action.payload;
    },
  },
});

export const {
  setPageFirstLoad,
  setShowInfoPanel,
  setInfoPanelTab,
  setShowDetailPanel,
  setShowFilter,
  setShowClearButton,
  setShowSharedLink,
  setMapPreview,
  clearMapPreview,
  setGeosearchSelection,
} = uiSlice.actions;

export default uiSlice.reducer;
