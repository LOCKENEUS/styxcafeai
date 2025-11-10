import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

const initialState = {
  customFields: [],
  selectedCustomField: null,
  loading: false,
  error: null,
};

// Thunk actions
export const getSaCustomFields = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`${BASE_URL}/superadmin/inventory/custom-field/list`);
    dispatch(setCustomFields(response.data.data));
  } catch (error) {
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    dispatch(setError(message));
  }
};

export const getSaCustomFieldById = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`${BASE_URL}/superadmin/inventory/custom-field/${id}`);
    dispatch(setSelectedCustomField(response.data.data));
  } catch (error) {
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    dispatch(setError(message));
  }
};

export const addSaCustomField = (fieldData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`${BASE_URL}/superadmin/inventory/custom-field`, fieldData);
    toast.success('Custom field added successfully!');
    dispatch(addField(response.data.data));
  } catch (error) {
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    dispatch(setError(message));
  }
};

export const updateSaCustomField = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`${BASE_URL}/superadmin/inventory/custom-field/${id}`, data);
    toast.success('Custom field updated successfully!');
    dispatch(updateField(response.data.data));
  } catch (error) {
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    dispatch(setError(message));
  }
};

export const deleteSaCustomField = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`${BASE_URL}/superadmin/inventory/custom-field/${id}`);
    toast.success('Custom field deleted successfully!');
    dispatch(removeField(id));
  } catch (error) {
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    dispatch(setError(message));
  }
};

const customFieldSlice = createSlice({
  name: 'customFields',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCustomFields: (state, action) => {
      state.loading = false;
      state.customFields = action.payload;
    },
    setSelectedCustomField: (state, action) => {
      state.loading = false;
      state.selectedCustomField = action.payload;
    },
    addField: (state, action) => {
      state.loading = false;
      state.customFields.push(action.payload);
    },
    updateField: (state, action) => {
      state.loading = false;
      const updatedField = action.payload;
      const index = state.customFields.findIndex((field) => field._id === updatedField._id);
      if (index !== -1) {
        state.customFields[index] = updatedField;
      }
    },
    removeField: (state, action) => {
      state.loading = false;
      state.customFields = state.customFields.filter((field) => field._id !== action.payload);
    },
  },
});

export const {
  startLoading,
  setError,
  setCustomFields,
  setSelectedCustomField,
  addField,
  updateField,
  removeField,
} = customFieldSlice.actions;

export default customFieldSlice.reducer;
