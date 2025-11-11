import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_API_URL;

const API_URL = `${BASE_URL}/superadmin/cafe`;

const initialState = {
  cafes: [],
  selectedCafe: null,
  loading: false,
  error: null,
};

// Async thunk to fetch all cafes
export const fetchCafes = createAsyncThunk("cafes/fetchCafes", async () => {
  const response = await axios.get(API_URL);
  // Assuming the response structure is as provided
  if (response.data.status) {
    return response.data.data; // Return the 'data' array from the response
  } else {
    throw new Error(response.data.message || "Failed to fetch cafes");
  }
});

export const fetchCafesID = createAsyncThunk("cafes/fetchCafesID", async () => {
  const response = await axios.get(`${API_URL}/${id}`);
  // Assuming the response structure is as provided
  if (response.data.status) {
    return response.data.data; // Return the 'data' array from the response
  } else {
    throw new Error(response.data.message || "Failed to fetch cafes");
  }
});

// Async thunk to add a new cafe
export const addCafe = createAsyncThunk(
  "cafes/addCafe",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status) {
        toast.success("Cafe added successfully!");
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to add cafe");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to update an existing cafe
// export const updateCafe = createAsyncThunk(
//   "cafes/updateCafe",
//   async ({ id, updatedData }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`${API_URL}/${id}`, updatedData);

//       if (response.data.status) {
//         toast.success("Cafe updated successfully!");
//         return response.data.data;
//       } else {
//         throw new Error(response.data.message || "Failed to update cafe");
//       }
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

export const updateCafe = createAsyncThunk(
  "cafes/updateCafe",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData, {
        headers: { "Content-Type": "multipart/form-data" }, // Ensure multipart/form-data is used for file uploads
      });

      if (response.data.status) {
        toast.success("Cafe updated successfully!");
        return response.data.data; // Return the updated cafe object
      } else {
        throw new Error(response.data.message || "Failed to update cafe");
      }
    } catch (error) {
      // Handle multer file size errors
      if (error.response?.status === 413 || error.code === 'LIMIT_FILE_SIZE') {
        return rejectWithValue({ message: 'File too large. Maximum file size is 10MB' });
      }
      // Handle multer file type errors  
      if (error.message && error.message.includes('Only image')) {
        return rejectWithValue({ message: error.message });
      }
      // Handle general errors
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update cafe';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Async thunk to delete a cafe
export const deleteCafe = createAsyncThunk("cafes/deleteCafe", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  toast.success("Cafe deleted successfully!");
  return id; // Return the id to remove it from the state
});

const cafeSlice = createSlice({
  name: "cafes",
  initialState,
  reducers: {
    setSelectedCafe: (state, action) => {
      state.selectedCafe = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchCafes.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(fetchCafes.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.cafes = action.payload;
  //     })
  //     .addCase(fetchCafes.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.error.message;
  //     })
  //     .addCase(addCafe.fulfilled, (state, action) => {
  //       state.cafes.push(action.payload);
  //     })
  //     .addCase(updateCafe.fulfilled, (state, action) => {
  //       const { index, cafe } = action.payload;
  //       state.cafes[index] = cafe;
  //     })
  //     .addCase(deleteCafe.fulfilled, (state, action) => {
  //       const index = action.payload;
  //       state.cafes.splice(index, 1);
  //     });
  // },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCafes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCafes.fulfilled, (state, action) => {
        state.loading = false;
        state.cafes = action.payload;
      })
      .addCase(fetchCafes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // fetchCafesID
      .addCase(fetchCafesID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCafesID.fulfilled, (state, action) => {
        state.loading = false;
        state.cafes = action.payload;
      })
      .addCase(fetchCafesID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCafe.fulfilled, (state, action) => {
        state.cafes.push(action.payload); // Add the new cafe to the list
      })
      .addCase(updateCafe.fulfilled, (state, action) => {
        const updatedCafe = action.payload; // The updated cafe object returned from the server
        const index = state.cafes.findIndex((cafe) => cafe._id === updatedCafe._id); // Find the index of the updated cafe
        if (index !== -1) {
          state.cafes[index] = updatedCafe; // Replace the old cafe with the updated one
        }
      })
      .addCase(deleteCafe.fulfilled, (state, action) => {
        const id = action.payload; // The id of the deleted cafe
        state.cafes = state.cafes.filter((cafe) => cafe._id !== id); // Remove the deleted cafe from the list
      });
  },
});

// Selector to get cafes
export const selectCafes = (state) => state.cafes.cafes;
export const selectLoading = (state) => state.cafes.loading;
export const selectError = (state) => state.cafes.error;

export const {
  setSelectedCafe,
} = cafeSlice.actions;

export default cafeSlice.reducer;
