// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const BASE_URL = import.meta.env.VITE_API_URL;

// // Async thunk
// export const createPurchaseReceive = createAsyncThunk(
//   'purchaseOrder/createPurchaseReceive',
//   async (POData, thunkAPI) => {
//     try {
//       const response = await axios.post(`${BASE_URL}/admin/inventory/po/receive`, POData);
//       toast.success('Purchase Receive added successfully!');
//       return response.data.data;
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Something went wrong');
//       return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
//     }
//   }
// );

// // 
// export const getPurchaseReceive = createAsyncThunk(
//   'soInvoice/getPurchaseReceive',
//   async (id, thunkAPI) => {
//     try {
//       const response = await axios.get(`${BASE_URL}/admin/inventory/po/receive/${id}`);
//       return response.data.data;
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Something went wrong');
//       return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
//     }
//   }
// );

// // Slice
// const purchaseReceiveSlice = createSlice({
//   name: 'purchaseReceive',
//   initialState: {
//     purchaseReceive: [],
//     selectedItem: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     setPurchaseReceiveItem: (state, action) => {
//       state.selectedItem = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createPurchaseReceive.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createPurchaseReceive.fulfilled, (state, action) => {
//         state.loading = false;
//         state.purchaseReceive.push(action.payload);
//       })
//       .addCase(createPurchaseReceive.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(getPurchaseReceive.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getPurchaseReceive.fulfilled, (state, action) => {
//         state.loading = false;
//         state.purchaseReceive.push(action.payload);
//       })
//       .addCase(getPurchaseReceive.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // Export actions and reducer
// export const { setPurchaseReceiveItem } = purchaseReceiveSlice.actions;
// export default purchaseReceiveSlice.reducer;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Async thunk to create a purchase receive
export const createPurchaseReceive = createAsyncThunk(
  'purchaseReceive/createPurchaseReceive',
  async (POData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/inventory/po/receive`, 
        POData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Purchase Receive added successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Async thunk to get a purchase receive by ID
export const getPurchaseReceive = createAsyncThunk(
  'purchaseReceive/getPurchaseReceive',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/po/receive/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

export const getPurchaseReceiveList = createAsyncThunk(
  'purchaseReceive/getPurchaseReceiveList',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/po/receive/list/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const purchaseReceiveSlice = createSlice({
  name: 'purchaseReceive',
  initialState: {
    purchaseReceiveList: [],       
    selectedItem: null,           
    loading: false,
    error: null,
  },
  reducers: {
    setPurchaseReceiveItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createPurchaseReceive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPurchaseReceive.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseReceiveList.push(action.payload); // Append new item
      })
      .addCase(createPurchaseReceive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(getPurchaseReceive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchaseReceive.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload; 
      })
      .addCase(getPurchaseReceive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getPurchaseReceiveList
      .addCase(getPurchaseReceiveList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchaseReceiveList.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload; 
      })
      .addCase(getPurchaseReceiveList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setPurchaseReceiveItem } = purchaseReceiveSlice.actions;
export default purchaseReceiveSlice.reducer;
