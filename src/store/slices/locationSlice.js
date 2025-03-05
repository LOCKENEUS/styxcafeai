import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

// Async thunk to fetch locations
export const getLocations = createAsyncThunk(
  "locations/getLocations",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/location`);
      return response.data; // Ensure response.data contains the array of locations
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to add a new location
export const addLocation = createAsyncThunk(
  "locations/addLocation",
  async (locationData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/superadmin/location`,
        locationData
      );
      toast.success("Location added successfully!");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to update an existing location
export const updateLocation = createAsyncThunk(
  "locations/updateLocation",
  async ({ id, updatedData }, thunkAPI) => {
    console.log("Updated Data from redux:", updatedData);
    try {
      const response = await axios.patch(
        `${BASE_URL}/superadmin/location/${id}`,
        updatedData
      );
      toast.success("Location updated successfully!");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to delete a location
export const deleteLocation = createAsyncThunk(
  "locations/deleteLocation",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/superadmin/location/${id}`);
      toast.success("Location deleted successfully!");
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

const locationSlice = createSlice({
  name: "locations",
  initialState: {
    locations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Locations
      .addCase(getLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload.data; // Save fetched locations in state
      })
      .addCase(getLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Location
      .addCase(addLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.locations.push(action.payload.data);
      })
      .addCase(addLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Location
      .addCase(updateLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.loading = false;
        const updatedLocation = action.payload.data;
        const index = state.locations.findIndex(
          (loc) => loc._id === updatedLocation._id
        );
        if (index !== -1) {
          state.locations[index] = updatedLocation;
        }
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Location
      .addCase(deleteLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = state.locations.filter(
          (loc) => loc._id !== action.payload
        ); // Use _id instead of id
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default locationSlice.reducer;
