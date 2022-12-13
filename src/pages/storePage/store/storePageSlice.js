import { createSlice } from "@reduxjs/toolkit";
import { fetchStoresData } from "./storePage.actions";

const initialState = {
  storesList: { dataMap: {}, dataList: [], loading: false }
};

export const storePageSlice = createSlice({
  name: "storePage",
  initialState: initialState,
  reducers: {
  },
  extraReducers: {
    [fetchStoresData.pending]: (state) => {
      state.storesList.loading = true
    },
    [fetchStoresData.fulfilled]: (state, actions) => {
      state.storesList.dataMap = actions.payload.dataMap;
      state.storesList.dataList = actions.payload.dataList;
      state.storesList.loading = false
    },
  }
});


export default storePageSlice.reducer