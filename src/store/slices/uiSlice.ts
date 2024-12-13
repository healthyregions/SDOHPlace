import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  pageFirstLoad: boolean;
  showInfoPanel: boolean;
  showDetailPanel: string;
  showFilter: boolean;
  showClearButton: boolean;
  showSharedLink: boolean;
}

const initialState: UIState = {
  pageFirstLoad: true,
  showInfoPanel: false,
  showDetailPanel: "",
  showFilter: false,
  showClearButton: false,
  showSharedLink: false,
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
  },
});

export const {
  setPageFirstLoad,
  setShowInfoPanel,
  setShowDetailPanel,
  setShowFilter,
  setShowClearButton,
  setShowSharedLink,
} = uiSlice.actions;

export default uiSlice.reducer;
