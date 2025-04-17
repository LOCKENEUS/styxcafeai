import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

// Async thunk to fetch bookings
export const getBookings = createAsyncThunk(
  "bookings/getbookings",
  async (cafeId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/booking/list/${cafeId}`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

export const getBookingsByDate = createAsyncThunk(
  "bookings/getbookingsByDate",
  async ({cafeId, date}, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/booking/list/${cafeId}/${date}`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

export const getBookingsByGame = createAsyncThunk(
  "bookings/getbookingsByGame",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/booking/game/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to add a new booking
export const addBooking = createAsyncThunk(
  "bookings/addbooking",
  async (bookingData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/booking`,
        bookingData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to update an existing booking
export const updateBooking = createAsyncThunk(
  "bookings/updatebooking",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/booking/${id}`,
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

export const addToCart = createAsyncThunk(
  "bookings/addToCart",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/booking/add-to-cart/${id}`,
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

export const getBookingDetails = createAsyncThunk(
  "bookings/bookingDetails",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/booking/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to delete a booking
export const deleteBooking = createAsyncThunk(
  "bookings/deletebooking",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/admin/booking/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

export const processOnlinePayment = createAsyncThunk(
  "bookings/processOnlinePayment",
  async (
    {
      selectedGame,
      selectedCustomer,
      slot,
      bookingId,
      payableAmount,
      paid_amount,
      total,
      looser,
      playerCredits,
    },
    thunkAPI
  ) => {
    try {
      const backend_url = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        `${backend_url}/admin/booking/payment`,
        {
          amount: payableAmount,
          currency: "INR",
          customerId: selectedCustomer?._id,
          gameId: selectedGame?._id,
          slotId: slot?._id,
          date: new Date().toISOString(),
          teamMembers: [],
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      );

      const data = response.data;

      if (data.success && data.order) {
        const options = {
          key: import.meta.env.VITE_RAZOR_LIVE_KEY,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Lockene Inc",
          description: "Game Booking",
          order_id: data.order.id,
          handler: async function (response) {
            try {
              const verifyResponse = await axios.post(
                `${backend_url}/admin/booking/verify-payment`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  booking_id: bookingId,
                  amount: data.order.amount,
                  paid_amount,
                  total,
                  looser,
                  playerCredits,
                },
                {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem(
                      "authToken"
                    )}`,
                  },
                }
              );

              const verifyData = verifyResponse.data;
              if (verifyData.success) {
                window.location.href = "/admin/bookings";
              } else {
                return thunkAPI.rejectWithValue("Payment Verification Failed");
              }
            } catch (error) {
              return thunkAPI.rejectWithValue(
                error.response?.data || "Payment verification error"
              );
            }
          },
          prefill: {
            name: selectedCustomer?.name,
            email: selectedCustomer?.email,
            contact: selectedCustomer?.contact_no,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        return { success: true, message: "Payment process initiated" };
      } else {
        return thunkAPI.rejectWithValue("Failed to create Razorpay order");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Payment error");
    }
  }
);

const bookingslice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    booking: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(getBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get bookings by date
      .addCase(getBookingsByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingsByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookingsByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch bookings by Game
      .addCase(getBookingsByGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingsByGame.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookingsByGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch booking details
      .addCase(getBookingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload.data;
      })
      .addCase(getBookingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add booking
      .addCase(addBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload.data);
      })
      .addCase(addBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      // AddToCart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // state.bookings.push(action.payload.data);
        toast.success("Item added to cart successfully");
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Failed to add item to cart");
      })

      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        const updatedbooking = action.payload.data; // Get updated booking from response
        const index = state.bookings.findIndex(
          (loc) => loc._id === updatedbooking._id
        ); // Use _id instead of id
        if (index !== -1) {
          state.bookings[index] = updatedbooking; // Update state
        }
        window.location.href = "/admin/bookings";
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(
          (loc) => loc._id !== action.payload
        ); // Use _id instead of id
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(processOnlinePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processOnlinePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(processOnlinePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookingslice.reducer;
