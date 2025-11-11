import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all salesOrders
export const getsalesOrders = createAsyncThunk(
  "salesOrder/getsalesOrders",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/so/list`,
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

// Fetch a single salesOrder by ID
export const getsalesOrderById = createAsyncThunk(
  "salesOrder/getsalesOrderById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/so/${id}`,
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

export const getsalesOrderByCafeId = createAsyncThunk(
  "salesOrder/getsalesOrderByCafeId",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/so/list/${id}`,
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

// Add a new salesOrder
export const addsalesOrder = createAsyncThunk(
  "salesOrder/addsalesOrder",
  async (soData, thunkAPI) => {
    try {
      // Determine the correct endpoint based on user role
      const user = JSON.parse(localStorage.getItem("user"));
      const endpoint = user?.role === 'superadmin' 
        ? `${BASE_URL}/superadmin/inventory/so`
        : `${BASE_URL}/admin/inventory/so`;
        
      const response = await axios.post(
        endpoint,
        soData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Sales Order added successfully!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Update a salesOrder
export const updatesalesOrder = createAsyncThunk(
  "salesOrder/updatesalesOrder",
  async ({ id, soData }, thunkAPI) => {
    try {
      // Determine the correct endpoint based on user role
      const user = JSON.parse(localStorage.getItem("user"));
      const endpoint = user?.role === 'superadmin' 
        ? `${BASE_URL}/superadmin/inventory/so/${id}`
        : `${BASE_URL}/admin/inventory/so/${id}`;
        
      const response = await axios.put(
        endpoint,
        soData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Sales Order updated successfully!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Delete a salesOrder
export const deletesalesOrder = createAsyncThunk(
  "salesOrder/deletesalesOrder",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/superadmin/inventory/so/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Sales Order deleted successfully!");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const soSlice = createSlice({
  name: "so",
  initialState: {
    salesOrders: [],
    selectedsalesOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedsalesOrder: (state, action) => {
      state.selectedsalesOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all salesOrders
      .addCase(getsalesOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getsalesOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.salesOrders = action.payload;
      })
      .addCase(getsalesOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get salesOrders by cafeId
      .addCase(getsalesOrderByCafeId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getsalesOrderByCafeId.fulfilled, (state, action) => {
        state.loading = false;
        state.salesOrders = action.payload;
      })
      .addCase(getsalesOrderByCafeId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get salesOrder by ID
      .addCase(getsalesOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getsalesOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedsalesOrder = action.payload;
      })
      .addCase(getsalesOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add salesOrder
      .addCase(addsalesOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addsalesOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.salesOrders.push(action.payload);
      })
      .addCase(addsalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete salesOrder
      .addCase(deletesalesOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletesalesOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.salesOrders = state.salesOrders.filter(
          (so) => so._id !== action.payload
        );
      })
      .addCase(deletesalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update salesOrder
      .addCase(updatesalesOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatesalesOrder.fulfilled, (state, action) => {
        state.loading = false;
        const updatedsalesOrder = action.payload;
        const index = state.salesOrders.findIndex(
          (so) => so._id === updatedsalesOrder._id
        );
        if (index !== -1) {
          state.salesOrders[index] = updatedsalesOrder;
        }
        if (
          state.selectedsalesOrder &&
          state.selectedsalesOrder._id === updatedsalesOrder._id
        ) {
          state.selectedsalesOrder = updatedsalesOrder;
        }
      })
      .addCase(updatesalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedsalesOrder } = soSlice.actions;
export default soSlice.reducer;
