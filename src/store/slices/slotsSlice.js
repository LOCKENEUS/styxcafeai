import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Async thunk to fetch slots
export const getslots = createAsyncThunk(
  "slots/getslots",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/slot/list/${id}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to add a new slot
export const addslot = createAsyncThunk(
  "slots/addslot",
  async (slotData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/superadmin/slot`,
        slotData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to update an existing slot
export const updateslot = createAsyncThunk(
  "slots/updateslot",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/superadmin/slot/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

export const getSlotDetails = createAsyncThunk(
  "slots/slotDetails",
  async ({ id }, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/slot/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to delete a slot
export const deleteslot = createAsyncThunk(
  "slots/deleteslot",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/superadmin/slot/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

const slotslice = createSlice({
  name: "slots",
  initialState: {
    slots: [],
    slot: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch slots
      .addCase(getslots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getslots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload.data;
      })
      .addCase(getslots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch slot details
      .addCase(getSlotDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSlotDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.slot = action.payload.data;
      })
      .addCase(getSlotDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add slot
      .addCase(addslot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addslot.fulfilled, (state, action) => {
        state.loading = false;
        state.slots.push(action.payload.data);
      })
      .addCase(addslot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update slot
      .addCase(updateslot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateslot.fulfilled, (state, action) => {
        state.loading = false;
        const updatedslot = action.payload.data; // Get updated slot from response
        const index = state.slots.findIndex(
          (loc) => loc._id === updatedslot._id
        ); // Use _id instead of id
        if (index !== -1) {
          state.slots[index] = updatedslot; // Update state
        }
      })
      .addCase(updateslot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete slot
      .addCase(deleteslot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteslot.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = state.slots.filter((loc) => loc._id !== action.payload); // Use _id instead of id
      })
      .addCase(deleteslot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slotslice.reducer;
