import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// const BASE_URL = process.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_API_URL;

export const addItems = createAsyncThunk(
  "Items/addItems",
  async (itemsData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/superadmin/inventory/item`,
        itemsData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

export const getItems = createAsyncThunk(
  "games/getItems",
  async (itemId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/item/list`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);


const InventorySlice = createSlice({
  name: "inventory",
  initialState: {
    it: [],
    selectedinventory: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setSelectedInventory(state, action) {
      state.selectedinventory = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(addItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addItems.fulfilled, (state, action) => {
        state.it.push(action.payload.data);
        toast.success("Item added successfully!");
        state.status = "succeeded";
      })
      .addCase(addItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload || "Failed to add item");
      })
      .addCase(getItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.inventory = action.payload;
      })
      .addCase(getItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setSelectedInventory } = InventorySlice.actions;

export default InventorySlice.reducer;
