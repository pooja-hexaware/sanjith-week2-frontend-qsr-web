import { createAsyncThunk } from "@reduxjs/toolkit";
import storePageService from "services/qsr-api-service/storePageService";

export const fetchStoresData = createAsyncThunk("storePage/fetchStoresData", async () => {
  try {
    const stores = await storePageService.getStores();
    let storeMap = {}
    for (const store of stores.data) {
      storeMap[store._id] = store;
    }
    console.log(storeMap)
    return {
      dataMap: storeMap,
      dataList: Object.values(storeMap)
    }
  }
  catch (err) {
    return {}
  }
})