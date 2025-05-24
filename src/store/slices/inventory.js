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
  async (thunkAPI) => {
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

// /superadmin/inventory/item-group
export const addItemsGroups = createAsyncThunk(
  "games/addItemsGroups",
  async (itemsData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/superadmin/inventory/item-group`,
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
export const getItemsGroups = createAsyncThunk(
  "games/getItemsGroups",
  async (itemId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/item-group/list`,
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
export const getItemsById = createAsyncThunk(
  "games/getItemsById",
  async (itemId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/item/${itemId}`,
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
export const getItemTransactions = createAsyncThunk(
  "games/getItemTransactions",
  async (itemId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/item/transactions/${itemId}`,
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
// /superadmin/inventory/item-group/:id
export const getItemsGroupsById = createAsyncThunk(
  "games/getItemsById",
  async (itemId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/item-group/${itemId}`,
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
export const deleteItemById = createAsyncThunk(
  "games/deleteItemById",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/superadmin/inventory/item/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });
      toast.success("Item deleted successfully!");
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);
// export const deleteItemGroupsById = createAsyncThunk(
//   "games/deleteItemGroupsById",
//   async (id, thunkAPI) => {
//     try {
//       await axios.delete(`${BASE_URL}/superadmin/inventory/item-group/${id}`, {
//         headers: {
//           Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
//         },
//       });
//       toast.success("Item deleted successfully!");
//       return id;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data || "Something went wrong"
//       );
//     }
//   }
// );

// /superadmin/inventory/item/

export const updateItemsById = createAsyncThunk(
  "games/updateItemsById",
  async ({ itemsData, itemId }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/superadmin/inventory/item/${itemId}`,
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

const InventorySlice = createSlice({
  name: "inventory",
  initialState: {
    it: [],
    itemTransactions: [],
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
      // addItemsGroups
      .addCase(addItemsGroups.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addItemsGroups.fulfilled, (state, action) => {
        state.it.push(action.payload.data);
        toast.success("Item added successfully!");
        state.status = "succeeded";
      })
      .addCase(addItemsGroups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload || "Failed to add item group");
      })

      // Get items
      .addCase(getItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.it = action.payload;
      })
      .addCase(getItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Transactions
      .addCase(getItemTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getItemTransactions.fulfilled, (state, action) => {
        state.itemTransactions = action.payload
        state.status = "succeeded";
      })
      .addCase(getItemTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload || "Failed to add item");
      })

      // Get item groups
      .addCase(getItemsGroups.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getItemsGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.inventory = action.payload;
      })
      .addCase(getItemsGroups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // getItemsById
      .addCase(getItemsById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getItemsById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.inventory = action.payload;
      })
      .addCase(getItemsById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // deleteItemByIdn
      .addCase(deleteItemById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteItemById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.inventory = state.inventory.filter(
          (item) => item._id !== action.payload
         
        );
         toast.success("Item deleted successfully!");
      })
      .addCase(deleteItemById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error("Item deleted failed!");
      })
  
       .addCase(updateItemsById.pending, (state) => {
         state.status = "loading";
       })
       .addCase(updateItemsById.fulfilled, (state, action) => {
         state.status = "succeeded";
         state.inventory = state.inventory.filter(
           (item) => item._id !== action.payload
         );
         toast.success("Item updated successfully!");
       })
       .addCase(updateItemsById.rejected, (state, action) => {
         state.status = "failed";
         state.error = action.payload;
         toast.error("Item updated failed!");
       });
  },
});

export const { setSelectedInventory } = InventorySlice.actions;

export default InventorySlice.reducer;
