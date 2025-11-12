import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

// Async thunk to fetch slots
export const getslots = createAsyncThunk(
  "slots/getslots",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/slot/list/${id}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// 24 hour format time
export const getslots24 = createAsyncThunk(
  "slots/getslots24",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/slot/list24/${id}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to add a new slot
export const addslot = createAsyncThunk(
  "slots/addslot",
  async (slotData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/superadmin/slot`,
        slotData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to copy slots
export const copySlots = createAsyncThunk(
  "slots/copySlots",
  async ({ game_id, day }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/superadmin/slot/copy/${game_id}/${day}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to update an existing slot
export const updateslot = createAsyncThunk(
  "slots/updateslot",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/superadmin/slot/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

export const getSlotDetails = createAsyncThunk(
  "slots/slotDetails",
  async ({ id }, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/slot/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to delete a slot
export const deleteslot = createAsyncThunk(
  "slots/deleteslot",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/superadmin/slot/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

const slotslice = createSlice({
  name: "slots",
  initialState: {
    slots: [],
    slot: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSlotDataManually: (state, action) => {
      state.slot = action.payload; // or state.slots if it's an array of slots
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch slots
      .addCase(getslots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getslots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload.data;
      })
      .addCase(getslots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getslots24.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getslots24.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload.data;
      })
      .addCase(getslots24.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch slot details
      .addCase(getSlotDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSlotDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.slot = action.payload.data;
      })
      .addCase(getSlotDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add slot
      .addCase(addslot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(addslot.fulfilled, (state, action) => {
      //   state.loading = false;
      //   // state.slots.push(action.payload.data);
      //   toast.success("Slot added successfully");
      // })
      .addCase(addslot.fulfilled, (state, action) => {
        state.loading = false;
      
        const slot = action.payload.data;
      
        // Helper function to convert "HH:mm" (24-hour) to "HH:MM AM/PM" format
        const formatTo12Hour = (timeStr) => {
          const [hourStr, minute] = timeStr.split(':');
          let hour = parseInt(hourStr, 10);
          const period = hour >= 12 ? 'PM' : 'AM';
          
          // Convert to 12-hour format
          if (hour === 0) {
            hour = 12;
          } else if (hour > 12) {
            hour = hour - 12;
          }
          
          // Pad with leading zero if needed
          const formattedHour = hour.toString().padStart(2, '0');
          return `${formattedHour}:${minute} ${period}`;
        };
      
        // Modify start and end time to match the display format
        const formattedSlot = {
          ...slot,
          start_time: formatTo12Hour(slot.start_time),
          end_time: formatTo12Hour(slot.end_time),
        };
      
        // Push formatted data to state
        state.slots.push(formattedSlot);
      
        toast.success("Slot added successfully");
      })
      .addCase(addslot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload.message || "Failed to add slot");
      })

      // Copy slots
      .addCase(copySlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(copySlots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots.push(action.payload.data);
        toast.success("Slots copied successfully");
      })
      .addCase(copySlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload.message || "Failed to add slot");
      })

      // Update slot
      .addCase(updateslot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateslot.fulfilled, (state, action) => {
        state.loading = false;
        const updatedslot = action.payload.data; // Get updated slot from response
        
        // Helper function to convert "HH:mm" (24-hour) to "HH:MM AM/PM" format
        const formatTo12Hour = (timeStr) => {
          const [hourStr, minute] = timeStr.split(':');
          let hour = parseInt(hourStr, 10);
          const period = hour >= 12 ? 'PM' : 'AM';
          
          // Convert to 12-hour format
          if (hour === 0) {
            hour = 12;
          } else if (hour > 12) {
            hour = hour - 12;
          }
          
          // Pad with leading zero if needed
          const formattedHour = hour.toString().padStart(2, '0');
          return `${formattedHour}:${minute} ${period}`;
        };
        
        // Format the updated slot times
        const formattedSlot = {
          ...updatedslot,
          start_time: formatTo12Hour(updatedslot.start_time),
          end_time: formatTo12Hour(updatedslot.end_time),
        };
        
        const index = state.slots.findIndex(
          (loc) => loc._id === updatedslot._id
        ); // Use _id instead of id
        if (index !== -1) {
          state.slots[index] = formattedSlot; // Update state with formatted slot
        }
      })
      .addCase(updateslot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete slot
      .addCase(deleteslot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteslot.fulfilled, (state, action) => {
        state.loading = false;
        // state.slots = state.slots.filter((loc) => loc._id !== action.payload); // Use _id instead of id
      })
      .addCase(deleteslot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slotslice.reducer;
export const { setSlotDataManually } = slotslice.actions;

