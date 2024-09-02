import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./slices/weatherSlice";

// Create a Redux store holding the state of the app
const store = configureStore({
    // Define the slice reducer
    reducer: {
        weather: weatherReducer,
    },
});

// Export the store
export default store;