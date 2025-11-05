import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/user`;

const initialState = {
  cafeDetails: null,
  gameDetails: null,
  bookings: [],
  loading: false,
  error: null,
};

export const fetchCafeDetails = createAsyncThunk(
  "user/fetchCafeDetails",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}/cafeDetails/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(
        "Error fetching cafe by ID: " +
        (error.response?.data?.message || "Something went wrong")
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const fetchGameDetails = createAsyncThunk(
  "user/fetchGameDetails",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/gameDetails/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(
        "Error fetching game by ID: " +
        (error.response?.data?.message || "Something went wrong")
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const processRazorPay = createAsyncThunk(
  "user/processRazorPay",
  async (
    {
      selectedGame,
      selectedCustomer,
      selectedSlotId,
      slotDate,
      startTime,
      endTime,
      payableAmount,
      paid_amount,
      total,
    },
    thunkAPI
  ) => {
    try {
      console.log("reached dispatch", selectedGame)
      const backend_url = import.meta.env.VITE_API_URL;

      const response = await axios.post(
        `${backend_url}/user/booking/payment`,
        {
          amount: payableAmount,
          currency: "INR",
          customerId: selectedCustomer?._id,
          gameId: selectedGame?._id,
          // slotIds: selectedSlots.map((slot) => slot._id), // assuming _id is available
          date: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const data = response?.data?.data;

      if (data) {
        const options = {
          key: import.meta.env.VITE_RAZOR_LIVE_KEY,
          amount: data.amount,
          currency: data.currency,
          name: "Lockene Inc",
          description: "Game Booking",
          order_id: data.id,
          handler: async function (response) {
            try {
              const verifyResponse = await axios.post(
                `${backend_url}/user/booking/payment/verify`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  booking_id: data.booking_id || null,
                  amount: data.amount,
                  paid_amount,
                  total,
                  customer_id: selectedCustomer?._id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                  },
                }
              );

              const verifyData = verifyResponse.data;
              console.log("verifyData", verifyData);
              if (verifyData.success) {
                // console.log("verifyData", verifyData);
                const response = await axios.post(
                  `${backend_url}/user/booking/create`,
                  {
                    customer_id: selectedCustomer?._id,
                    game_id: selectedGame?._id,
                    game_amount: selectedGame?.amount,
                    slot_id: selectedSlotId,
                    slot_date: slotDate,
                    total: total,
                    booking_status: "Confirmed",
                    paid_amount: total,
                    mode: "Online",
                    txn_id: verifyData.transaction.id,
                    cafe: selectedGame?.cafe
                  }
                )
                // window.location.href = `/admin/booking/checkout/${verifyData.transaction.booking_id}`;
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

export const fetchBookingList = createAsyncThunk(
  "user/fetchBookingList",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/booking/list/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(
        "Error fetching user bookings: " +
        (error.response?.data?.message || "Something went wrong")
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const authSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCafeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCafeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.cafeDetails = action.payload;
      })
      .addCase(fetchCafeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchGameDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.gameDetails = action.payload;
      })
      .addCase(fetchGameDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBookingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingList.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;