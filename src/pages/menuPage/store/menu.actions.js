import { createAsyncThunk } from "@reduxjs/toolkit";
import comboService from "services/qsr-api-service/comboService";
import orderService from "services/qsr-api-service/orderService";

export const fetchComboData = createAsyncThunk('menu/fetchComboData', async(data) => {
    const fetchCombos = async() => {
        return await comboService.getCombos().then((res) => {
            return res.data
        })
    }
    try {
        const combos = await fetchCombos();
        
        let menuItems = Object.keys(data.menuItems)
        let finalComboDetails = []
        let finalComboDiscount = 0
        let pairCount = 0

        console.log(Object.values(data.menuItems))
        for (const menuValue of Object.values(data.menuItems)) {
            if (menuValue.amount === 2) {
                console.log("In Amount :", menuValue.amount);
                finalComboDiscount = +(finalComboDiscount + 0.15).toFixed(2);
                finalComboDetails.push([{discountPrice : "0.15"}])
            }
        }

        for (const combo of combos) {
            combo.menuItems.map((menuItem) => {
                if (menuItems.includes(menuItem)) {
                    pairCount = pairCount + 1
                }
            })
            if (pairCount === 2) {
                finalComboDetails.push(combo)
                finalComboDiscount = +(finalComboDiscount + combo.discount).toFixed(2);
            }
            pairCount = 0
        }
        console.log("fetchComboData:", menuItems, finalComboDetails, finalComboDiscount)
        return {
            comboDetails: finalComboDetails,
            conboTotal: finalComboDiscount
        }
    }
    catch(err) {
        return []
    }
})

export const addOrder = (order) => {
    return async() => {
        try {
            return await orderService.addOrder(order)
        }
        catch(err) {
            return err;
        }
    }
}