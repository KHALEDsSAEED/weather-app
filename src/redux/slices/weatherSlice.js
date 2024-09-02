import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Define the initial state of the slice
const initialState = {
    citySearchLoading: false,
    citySearchData: null,
    citySearchError: null,
    forecastLoading: false,
    forecastData: null,
    forecastError: null,
};

// Define the async thunk for fetching weather data by city name
export const citySearch = createAsyncThunk(
    "weather/citySearch",
    async (o, { rejectWithValue }) => {
        try {
            // Fetch weather data by city name
            const req = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${o.city}&appid=${import.meta.env.VITE_API_KEY}&units=${o.unit}`
            );

            // Parse the JSON response
            const res = await req.json();

            // Check if the request was successful
            if (!req.ok) {
                // Handle error if the request was not successful
                return rejectWithValue(res.message);
            }

            // Return the response data
            return res;

        } catch (error) {
            // Handle errors
            return rejectWithValue(error.message);
        }
    }
);

// Define the async thunk for fetching forecast data by city name
export const forecast = createAsyncThunk(
    "weather/forecast",
    async (o, { rejectWithValue }) => {
        try {
            // Fetch forecast data by city name
            const req = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${o.city}&appid=${import.meta.env.VITE_API_KEY}&units=${o.unit}`
            );

            // Parse the JSON response
            const res = await req.json();

            // Check if the request was successful
            if (!req.ok) {
                // Handle error if the request was not successful
                return rejectWithValue(res.message);
            }

            // Return the response data
            return res;

        } catch (error) {
            // Handle errors
            return rejectWithValue(error.message);
        }
    }
);

// Define the weather slice
const weatherSlice = createSlice({
    name: "weather", 
    initialState, 
    reducers: {}, 
    // Define the reducers for the slice
    extraReducers: (builder) => {
        // Reducers for the city search and forecast async thunks
        builder
            .addCase(citySearch.pending, (state) => { // Reducer for the pending state
                state.citySearchLoading = true; // Set the loading state to true
                state.citySearchError = null; // Reset the error state to null
            })
            .addCase(citySearch.fulfilled, (state, action) => { // Reducer for the fulfilled state
                state.citySearchLoading = false; 
                state.citySearchData = action.payload; // Store the response data in the state
            })
            .addCase(citySearch.rejected, (state, action) => { // Reducer for the rejected state
                state.citySearchLoading = false;
                state.citySearchError = action.error.message;
            })
            .addCase(forecast.pending, (state) => { // Reducer for the pending state
                state.forecastLoading = true;
                state.forecastError = null;
                state.forecastData = null;
            })
            .addCase(forecast.fulfilled, (state, action) => { // Reducer for the fulfilled state
                state.forecastLoading = false;
                state.forecastData = action.payload;
                state.forecastError = null;
            })
            .addCase(forecast.rejected, (state, action) => { // Reducer for the rejected state
                state.forecastLoading = false;
                state.forecastError = action.error.message;
                state.forecastData = null;
            });
    },
});


// Export the weather slice reducer
export default weatherSlice.reducer;