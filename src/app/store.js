// internal imports
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

// external imports
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";

// the code creates a Redux store that combines the reducers for the API and authentication states and includes middleware to handle API requests with the store. It also enables the Redux DevTools extension for debugging.
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: false,
});

setupListeners(store.dispatch); // setupListeners is a Redux Toolkit function that allows us to subscribe to the Redux store's updates.
