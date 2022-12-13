import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "QSR User",
    phone: "9653254678",
    email: "qsr@email.com"
};

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        logoutUser: (state) => {
            state = initialState
        }
    },
});

export const { logoutUser } = userSlice.actions

export default userSlice.reducer