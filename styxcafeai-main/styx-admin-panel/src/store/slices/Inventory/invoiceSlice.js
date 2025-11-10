import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all salesOrders
export const getSalesInvoiceList = createAsyncThunk(
  "saSalesInvoice/getSalesInvoiceList",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/so/invoice/list`,
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
export const getSalesInvoiceDetails = createAsyncThunk(
  "saSalesInvoice/getSalesInvoiceDetails",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/so/invoice/${id}`,
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

// export const getsalesOrderByCafeId = createAsyncThunk(
//   "saSalesInvoice/getsalesOrderByCafeId",
//   async (id, thunkAPI) => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/superadmin/inventory/so/list/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         }
//       );
//       return response.data.data;
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Something went wrong");
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Something went wrong"
//       );
//     }
//   }
// );

// Add a new salesOrder

export const createSalesInvoice = createAsyncThunk(
  "saSalesInvoice/addsalesOrder",
  async (soData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/superadmin/inventory/so/invoice`,
        soData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Sales Invoice created successfully!");
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
export const updateSalesInvoice = createAsyncThunk(
  "saSalesInvoice/updateSalesInvoice",
  async ({ id, siData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/superadmin/inventory/so/invoice/${id}`,
        siData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Sales Invoice updated successfully!");
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
export const deleteSalesInvoice = createAsyncThunk(
  "saSalesInvoice/deleteSalesInvoice",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/superadmin/inventory/so/invoice/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Sales Invoice deleted successfully!");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const collectInvoicePayment = createAsyncThunk(
  "saSalesInvoice/collectInvoicePayment",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/superadmin/inventory/so/invoice/payment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Sales Invoice payment collected successfully!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const getInvoicePaymentList = createAsyncThunk(
  "saSalesInvoice/invoicePaymentList",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/so/invoice/payment/list`,
        formData,
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

const siSlice = createSlice({
  name: "saSalesInvoice",
  initialState: {
    salesInvoiceList: [],
    invoicePaymentList: [],
    selectedSalesInvoice: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedSalesInvoice: (state, action) => {
      state.selectedSalesInvoice = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get sales invoice list
      .addCase(getSalesInvoiceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesInvoiceList.fulfilled, (state, action) => {
        state.loading = false;
        state.salesInvoiceList = action.payload;
      })
      .addCase(getSalesInvoiceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get invoice payment list
      .addCase(getInvoicePaymentList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvoicePaymentList.fulfilled, (state, action) => {
        state.loading = false;
        state.invoicePaymentList = action.payload;
      })
      .addCase(getInvoicePaymentList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get salesOrder by ID
      .addCase(getSalesInvoiceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesInvoiceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSalesInvoice = action.payload;
      })
      .addCase(getSalesInvoiceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add salesOrder
      .addCase(createSalesInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSalesInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.salesInvoiceList.push(action.payload);
      })
      .addCase(createSalesInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete salesOrder
      .addCase(deleteSalesInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSalesInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.salesInvoiceList = state.salesInvoiceList.filter(
          (si) => si._id !== action.payload
        );
      })
      .addCase(deleteSalesInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update salesOrder
      .addCase(updateSalesInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSalesInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSalesInvoice = action.payload;
        const index = state.salesInvoiceList.findIndex(
          (si) => si._id === updatedSalesInvoice._id
        );
        if (index !== -1) {
          state.salesInvoiceList[index] = updatedSalesInvoice;
        }
        if (
          state.selectedSalesInvoice &&
          state.selectedSalesInvoice._id === updatedSalesInvoice._id
        ) {
          state.selectedSalesInvoice = updatedSalesInvoice;
        }
      })
      .addCase(updateSalesInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedSalesInvoice } = siSlice.actions;
export default siSlice.reducer;
