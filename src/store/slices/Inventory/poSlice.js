import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

export const createSaPurchaseOrder = createAsyncThunk(
  "saPurchaseOrder/createSaPurchaseOrder",
  async (POData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/superadmin/inventory/po`,
        POData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Purchase Order added successfully!");
      return response.data.data;
    } catch (error) {
      let errorMessage =
        error.response?.data?.message || "Something went wrong";

      toast.error(errorMessage); // Show error toast
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const updateSaPurchaseOrder = createAsyncThunk(
  "saPurchaseOrder/updateSaPurchaseOrder",
  async ({ id, POData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/superadmin/inventory/po/${id}`,
        POData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Purchase Order updated successfully!");
      return response.data.data;
    } catch (error) {
      let errorMessage =
        error.response?.data?.message || "Something went wrong";

      toast.error(errorMessage); // Show error toast
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// /admin/inventory/po/list/:id
export const getSaPOList = createAsyncThunk(
  "saPurchaseOrder/getSaPOList",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/po/list`,
        {
          headers: {
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

// Purchase orders by vendor
export const getSaPOListByVendor = createAsyncThunk(
  "saPurchaseOrder/getSaPOListByVendor",
  async ({ id, vendor }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/po/list/${vendor}`,
        {
          headers: {
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

// /admin/inventory/po/:id
export const getSaPurchaseOrder = createAsyncThunk(
  "saPurchaseOrder/getSaPurchaseOrder",
  async (id, thunkAPI) => {
    try {
      // const response = await axios.get(`${BASE_URL}/admin/inventory/po/${id}`);
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/po/${id}`,
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

// /admin/inventory/item
const poSlice = createSlice({
  name: "purchaseOrder",
  initialState: {
    purchaseOrder: [],
    selectedItem: null,
    selectedPo: null,
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
      // Create perchase order
      .addCase(createSaPurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSaPurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })
      .addCase(createSaPurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getOPList
      .addCase(getSaPOList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaPOList.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrder = action.payload;
      })
      .addCase(getSaPOList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getOPList
      .addCase(getSaPOListByVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaPOListByVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrder = action.payload;
      })
      .addCase(getSaPOListByVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getPO
      .addCase(getSaPurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaPurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPo = action.payload;
      })
      .addCase(getSaPurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedItem } = poSlice.actions;
export default poSlice.reducer;
