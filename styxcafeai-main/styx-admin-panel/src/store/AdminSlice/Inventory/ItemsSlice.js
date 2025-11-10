import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all items
export const getItems = createAsyncThunk(
  "items/getItems",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/inventory/item/list/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Fetch all items transactions
export const getItemTransactions = createAsyncThunk(
  "items/getItemTransactions",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/inventory/item/transactions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Fetch a single item by ID
export const getItemById = createAsyncThunk(
  "items/getItemById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/inventory/item/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Add a new item
export const addItem = createAsyncThunk(
  "items/addItem",
  async (itemData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/inventory/item`,
        itemData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Item added successfully!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Update an item
export const updateItem = createAsyncThunk(
  "items/updateItem",
  async ({ id, itemData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/inventory/item/${id}`,
        itemData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Item updated successfully!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Delete an item
export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/admin/inventory/item/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Item deleted successfully!");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// item qty tracking
export const getItemsCount = createAsyncThunk(
  "items/getItemsCount",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/inventory/po/receive-qty/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    itemTransactions: [],
    selectedItem: null,
    itemsCount: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all items
      .addCase(getItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get item transactions
      .addCase(getItemTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItemTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.itemTransactions = action.payload;
      })
      .addCase(getItemTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get item by ID
      .addCase(getItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })
      .addCase(getItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add item
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // items tracking
      .addCase(getItemsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItemsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.itemsCount = action.payload;
      })
      .addCase(getItemsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update item
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload;
        // Find the item in the array and update it
        const index = state.items.findIndex(
          (item) => item._id === updatedItem._id
        );
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
        // Also update selectedItem if it's the same item
        if (state.selectedItem && state.selectedItem._id === updatedItem._id) {
          state.selectedItem = updatedItem;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedItem } = itemsSlice.actions;
export default itemsSlice.reducer;
