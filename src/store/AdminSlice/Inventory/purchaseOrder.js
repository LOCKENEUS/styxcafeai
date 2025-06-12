import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

export const CreateVendor = createAsyncThunk(
  "purchaseOrder/createVendor",
  async (vendorData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/inventory/vendor`,
        vendorData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Vendor added successfully!");
      return response.data.data;
    } catch (error) {
      let errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage); // Show error toast for CreateVendor

      // Check if the error is a duplicate email
      if (
        errorMessage.includes("E11000 duplicate key error") &&
        errorMessage.includes("email")
      ) {
        errorMessage = "Email already exists!";
      }

      toast.error(errorMessage); // Show error toast
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const GetVendorsList = createAsyncThunk(
  "purchaseOrder/getVendorsList",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/inventory/vendor/list/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong"); // Show error toast for GetVendorsList
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const CreatePurchaseOrder = createAsyncThunk(
  "purchaseOrder/CreatePurchaseOrder",
  async (POData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/inventory/po`,
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

export const UpdatePurchaseOrder = createAsyncThunk(
  "purchaseOrder/UpdatePurchaseOrder",
  async ({ id, POData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/inventory/po/${id}`,
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
export const GetPOList = createAsyncThunk(
  "purchaseOrder/GetPOList",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/inventory/po/list/${id}`,
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

// cafe PO with styxcafe
export const GetCafePOList = createAsyncThunk(
  "purchaseOrder/GetCafePOList",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/inventory/po/cafe/list/${id}`,
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
export const GetPOListByVendor = createAsyncThunk(
  "purchaseOrder/GetPOListByVendor",
  async ({ id, vendor }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/inventory/po/list/${id}/${vendor}`,
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
export const GetPurchaseOrder = createAsyncThunk(
  "purchaseOrder/GetPurchaseOrder",
  async (id, thunkAPI) => {
    try {
      // const response = await axios.get(`${BASE_URL}/admin/inventory/po/${id}`);
      const response = await axios.get(`${BASE_URL}/admin/inventory/po/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// send mail to vendor

export const sendMailToVendor = createAsyncThunk(
  "purchaseOrder/sendMail",
  async (orderData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/inventory/po/send-mail`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Mail sent successfully!");
      return response.data.data;
    } catch (error) {
      let errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage); // Show error toast for CreateVendor

      // Check if the error is a duplicate email
      if (
        errorMessage.includes("E11000 duplicate key error") &&
        errorMessage.includes("email")
      ) {
        errorMessage = "Email already exists!";
      }

      toast.error(errorMessage); // Show error toast
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getStyxData = createAsyncThunk(
  "purchaseOrder/getStyxData",
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/user`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("response", response.data);
      return response.data.data;
    } catch (error) {
      toast.error("Failed to fetch Styx data");
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch Styx data"
      );
    }
  }
);

// /admin/inventory/item
const OPSlice = createSlice({
  name: "purchaseOrder",
  initialState: {
    purchaseOrder: [],
    selectedItem: null,
    selectedPo: null,
    styxData: null,
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
      // Get all vendors
      .addCase(GetVendorsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetVendorsList.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(GetVendorsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get cafe PO with superadmin
      .addCase(GetCafePOList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetCafePOList.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrder = action.payload;
      })
      .addCase(GetCafePOList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get cafe PO with superadmin
      .addCase(getStyxData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStyxData.fulfilled, (state, action) => {
        state.loading = false;
        state.styxData = action.payload;
      })
      .addCase(getStyxData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create vendor
      .addCase(CreateVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })
      .addCase(CreateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create perchase order
      .addCase(CreatePurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreatePurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })
      .addCase(CreatePurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getOPList
      .addCase(GetPOList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetPOList.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })
      .addCase(GetPOList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getOPList
      .addCase(GetPOListByVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetPOListByVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrder = action.payload;
      })
      .addCase(GetPOListByVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getPO
      .addCase(GetPurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetPurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPo = action.payload;
      })
      .addCase(GetPurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedItem } = OPSlice.actions;
export default OPSlice.reducer;
