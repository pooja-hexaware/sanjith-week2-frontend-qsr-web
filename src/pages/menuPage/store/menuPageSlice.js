import { createSlice } from '@reduxjs/toolkit';
import { fetchComboData } from './menu.actions';

const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        menuList: { data: {}, loading: true },
        toppingsDialog: { props: { open: false, menuId: "" } },
        orderDialog: { props: { open: false } },
        selectedToppings: { data: {}, details: {} },
        selectedMenuItems: { data: {}, comboDetails: [], comboTotal: 0, netPrice: 0, finalPrice: 0, finalCouponPrice: 0 },
    },
    reducers: {
        setStoreMenu: (state, action) => {
            let menuItems = {}
            let selectedTopping = {}
            console.log(menuItems)
            for (const menu of action.payload) {
                let menuObj = {
                    ...menu,
                    amount: 1
                }
                menuItems[menu._id] = menuObj
                selectedTopping[menu._id] = []
            }
            state.menuList.data = menuItems;
            state.selectedToppings.data = selectedTopping
        },
        setMenuAmount: (state, action) => {
            state.menuList.data[action.payload.id] = action.payload.object
        },
        setSelectedToppings: (state, action) => {
            state.selectedToppings.data[action.payload.id] = action.payload.object
            for (const menuToppings of state.menuList.data[action.payload.id]?.toppings) {
                if (action.payload.object.includes(menuToppings._id)) {
                    state.selectedToppings.details[menuToppings._id] = menuToppings
                }
            }
        },
        unsetSelectedToppings: (state, action) => {
            state.selectedToppings.data[action.payload.id] = action.payload.object
        },
        addMenuItem: (state, action) => {
            console.log(action.payload.object)
            if (Object.keys(state.selectedMenuItems.data).includes(action.payload.id)) {
                console.log("In IF")
                let updatedMenuItem = {
                    ...action.payload.object,
                    amount: state.selectedMenuItems.data[action.payload.id]?.amount + action.payload.object.amount,
                }
                state.selectedMenuItems.data[action.payload.id] = updatedMenuItem
            }
            else {
                console.log("In ELSE")
                state.selectedMenuItems.data[action.payload.id] = action.payload.object
            }
        },
        removeMenuItem: (state, action) => {

        },
        calculateNetPrice: (state) => {
            let finalprice = 0
            Object.values(state.selectedMenuItems.data).map((menuItem) => {
                finalprice = finalprice + (menuItem?.price * menuItem?.amount)
                state.selectedToppings.data[menuItem.id].map((toppingId) => {
                    finalprice = finalprice + state.selectedToppings.details[toppingId]?.price
                })
            })
            state.selectedMenuItems.netPrice = +(finalprice).toFixed(2)
        },
        setFinalPrice: (state) => {
            state.selectedMenuItems.finalPrice = +(state.selectedMenuItems.netPrice - state.selectedMenuItems.comboTotal).toFixed(2)
            state.selectedMenuItems.finalCouponPrice = +(state.selectedMenuItems.netPrice - state.selectedMenuItems.comboTotal).toFixed(2)
        },
        setCouponFinalPrice: (state, action) => {
            state.selectedMenuItems.finalCouponPrice = +(state.selectedMenuItems.finalPrice - action.payload).toFixed(2)
        },
        resetOrderData: (state) => {
            state.selectedMenuItems = { data: {}, comboDetails: [], comboTotal: 0, netPrice: 0, finalPrice: 0, finalCouponPrice: 0 };
        },
        openToppingsDialog: (state, action) => {
            state.toppingsDialog.props.open = true;
            state.toppingsDialog.props.menuId = action.payload
        },
        closeToppingsDialog: (state) => {
            state.toppingsDialog.props.open = false
        },
        openOrderDialog: (state) => {
            state.orderDialog.props.open = true;
        },
        closeOrderDialog: (state) => {
            state.orderDialog.props.open = false
        }
    },
    extraReducers: {
        [fetchComboData.fulfilled]: (state, action) => {
            state.selectedMenuItems.comboDetails = action.payload.comboDetails;
            state.selectedMenuItems.comboTotal = action.payload.conboTotal;
        },
    },
});

export const { setStoreMenu, setMenuAmount, setSelectedToppings, unsetSelectedToppings, addMenuItem, removeMenuItem, calculateNetPrice, setFinalPrice, setCouponFinalPrice, resetOrderData, openToppingsDialog, closeToppingsDialog, openOrderDialog, closeOrderDialog } = menuSlice.actions;

export default menuSlice.reducer;
