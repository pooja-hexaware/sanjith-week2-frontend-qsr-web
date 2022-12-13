import { configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import notificationReducer from '../middleware/notification/store/notificationSlice'
import userReducer from './userSlice'
import storeReducer from '../pages/storePage/store/storePageSlice'
import menuReducer from '../pages/menuPage/store/menuPageSlice'

let middlewares = []
if (process.env.NODE_ENV === `development`) {
    const logger = createLogger({
        collapsed: (getState, action, logEntry) => !logEntry.error,
    })
    middlewares.push(logger)
}

export default configureStore({
    reducer: {
        notification: notificationReducer,
        user: userReducer,
        stores: storeReducer,
        menu: menuReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middlewares),
    devTools: process.env.NODE_ENV !== 'production',
})
