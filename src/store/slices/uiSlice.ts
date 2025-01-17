import { createSlice } from "@reduxjs/toolkit";

interface MapPreviewLyr {
  lyrId: string;
  filterIds: string[];
}

interface UIState {
  pageFirstLoad: boolean;
  showInfoPanel: boolean;
  showDetailPanel: string;
  showFilter: boolean;
  showClearButton: boolean;
  showSharedLink: boolean;
  mapPreview: MapPreviewLyr[];
}

const initialState: UIState = {
  pageFirstLoad: true,
  showInfoPanel: false,
  showDetailPanel: "",
  showFilter: false,
  showClearButton: false,
  showSharedLink: false,
  mapPreview: [],
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
    setMapPreview: (state, action) => {
      state.mapPreview = action.payload;
    },
  },
});

export const {
  setPageFirstLoad,
  setShowInfoPanel,
  setShowDetailPanel,
  setShowFilter,
  setShowClearButton,
  setShowSharedLink,
  setMapPreview,
} = uiSlice.actions;

export default uiSlice.reducer;
