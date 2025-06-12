import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

const initialState = {
  isAdminAuthenticated: false,
  email: "",
  adminAuthToken: null,
  loading: false,
  error: null,
};

export const loginAdmin = createAsyncThunk(
  "adminAuth/loginAdmin",
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, adminData, {
        headers: { "Content-Type": "application/json" },
      });

      const { data } = response;

      if (!data || !data.data) {
        throw new Error("Invalid response structure from server");
      }
      toast.success("Admin login successful");
      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("userRole", JSON.stringify(data.data.user.role));
      localStorage.setItem("user", JSON.stringify(data.data.user));

      return data.data;
    } catch (error) {
      toast.error("Admin login failed");
      return rejectWithValue(
        error.response?.data?.message || error.message || "Admin login failed"
      );
    }
  }
);

export const adminSendPasswordResetEmail = createAsyncThunk(
  "adminAuth/sendPasswordResetEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/forget-password`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Admin OTP sent successfully");

      return response.data;
    } catch (error) {
      toast.error("Failed to send admin OTP");
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to send admin OTP"
      );
    }
  }
);

export const adminResetPassword = createAsyncThunk(
  "adminAuth/resetPassword",
  async ({ email, newPassword, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/reset-password`,
        { email, newPassword, otp },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Admin password reset successful");
      return response.data;
    } catch (error) {
      toast.error("Failed to reset admin password");
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to reset admin password"
      );
    }
  }
);

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminLoginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    adminLoginSuccess: (state, action) => {
      state.loading = false;
      state.isAdminAuthenticated = true;
      state.email = action.payload.email;
      state.adminAuthToken = action.payload.token;
    },
    adminLoginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    adminLogout: (state) => {
      state.isAdminAuthenticated = false;
      state.email = "";
      state.adminAuthToken = null;
      localStorage.removeItem("adminAuthToken");
      localStorage.removeItem("adminRole");
      localStorage.removeItem("admin");
    },
    setAdminPasswordResetEmail: (state, action) => {
      state.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminSendPasswordResetEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(adminSendPasswordResetEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(adminResetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(adminResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAdminAuthenticated = true;
        state.email = action.payload.admin.email;
        state.adminAuthToken = action.payload.token;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  adminLoginStart,
  adminLoginSuccess,
  adminLoginFailure,
  adminLogout,
  setAdminPasswordResetEmail,
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
