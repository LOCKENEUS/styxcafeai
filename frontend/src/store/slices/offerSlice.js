import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all offers
export const getOffers = createAsyncThunk(
  'offers/getOffers',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/offer`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Fetch offers by cafe ID
export const getOffersByCafeId = createAsyncThunk(
  'offers/getOffersByCafeId',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/offer/list/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Fetch a single offer by ID
export const getOfferById = createAsyncThunk(
  'offers/getOfferById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/offer/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Add a new offer
export const addOffer = createAsyncThunk(
  'offers/addOffer',
  async (offerData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/superadmin/offer`, offerData);
      toast.success('Offer added successfully!');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Update an existing offer
export const updateOffer = createAsyncThunk(
  'offers/updateOffer',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/superadmin/offer/${id}`, data);
      toast.success('Offer updated successfully!');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Delete an offer
export const deleteOffer = createAsyncThunk(
  'offers/deleteOffer',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/superadmin/offer/${id}`);
      toast.success('Offer deleted successfully!');
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const offerSlice = createSlice({
  name: 'offers',
  initialState: {
    offers: [],
    selectedOffer: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedOffer: (state, action) => {
      state.selectedOffer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all offers
      .addCase(getOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(getOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch offer by ID
      .addCase(getOfferById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOfferById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOffer = action.payload;
      })
      .addCase(getOfferById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Offer
      .addCase(addOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers.push(action.payload);
      })
      .addCase(addOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Offer
      .addCase(updateOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOffer = action.payload;
        const index = state.offers.findIndex((offer) => offer._id === updatedOffer._id);
        if (index !== -1) {
          state.offers[index] = updatedOffer;
        }
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Offers by Cafe ID
      .addCase(getOffersByCafeId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOffersByCafeId.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(getOffersByCafeId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Offer
      .addCase(deleteOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = state.offers.filter((offer) => offer._id !== action.payload);
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOffer } = offerSlice.actions;
export default offerSlice.reducer;
