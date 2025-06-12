import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all Purchase Bills
export const getPBills = createAsyncThunk(
  "pBill/getPBills",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/inventory/po/bill/list/${id}`,
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

// Fetch a single Purchase Bill by ID
export const getPBillById = createAsyncThunk(
  "pBill/getPBillById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/po/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Add a new Purchase Bill
export const addPBill = createAsyncThunk(
  "pBill/addPBill",
  async (billData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/inventory/po/bill`,
        billData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Purchase Bill added successfully!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Update a Purchase Bill
export const updatePBill = createAsyncThunk(
  "pBill/updatePBill",
  async ({ id, billData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/inventory/po/bill/${id}`,
        billData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Purchase Bill updated successfully!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Delete a Purchase Bill
export const deletePBill = createAsyncThunk(
  "pBill/deletePBill",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/admin/inventory/po/bill/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Purchase Bill deleted successfully!");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const pBillSlice = createSlice({
  name: "pBill",
  initialState: {
    bills: [],
    selectedBill: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedBill: (state, action) => {
      state.selectedBill = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all Purchase Bills
      .addCase(getPBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
      })
      .addCase(getPBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Purchase Bill by ID
      .addCase(getPBillById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPBillById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBill = action.payload;
      })
      .addCase(getPBillById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Purchase Bill
      .addCase(addPBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills.push(action.payload);
      })
      .addCase(addPBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Purchase Bill
      .addCase(deletePBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = state.bills.filter((bill) => bill._id !== action.payload);
      })
      .addCase(deletePBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Purchase Bill
      .addCase(updatePBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePBill.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBill = action.payload;
        const index = state.bills.findIndex(
          (bill) => bill._id === updatedBill._id
        );
        if (index !== -1) {
          state.bills[index] = updatedBill;
        }
        if (state.selectedBill && state.selectedBill._id === updatedBill._id) {
          state.selectedBill = updatedBill;
        }
      })
      .addCase(updatePBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedBill } = pBillSlice.actions;
export default pBillSlice.reducer;
