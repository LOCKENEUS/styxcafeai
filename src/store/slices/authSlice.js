import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";


const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/superadmin/cafe`;

const initialState = {
  isAuthenticated: false,
  email: "",
  authToken: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, userData, {
        headers: { "Content-Type": "application/json" },
      });

      const { data } = response;

      if (!data || !data.data) {
        throw new Error("Invalid response structure from server");
      }
      toast.success("Login successful");
      sessionStorage.setItem("authToken", data.data.token);
      sessionStorage.setItem("userRole", JSON.stringify(data.data.user.role));
      sessionStorage.setItem("user", JSON.stringify(data.data.user));

      return data.data;
    } catch (error) {
      toast.error("Login failed");

      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }
);

export const Adminlogin = createAsyncThunk(
  "auth/Adminlogin",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/admin/login`,
        userData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { data } = response;
      if (!data || !data.data) {
        throw new Error("Invalid response structure from server");
      }
      toast.success("Login successful");
      sessionStorage.setItem("authToken", data.data.token);
      sessionStorage.setItem("userRole", JSON.stringify(data.data.cafe.role));
      sessionStorage.setItem("user", JSON.stringify(data.data.cafe));

      return data.data;
    } catch (error) {
      toast.error("Login failed");

      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }
);

export const sendPasswordResetEmail = createAsyncThunk(
  "auth/sendPasswordResetEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/forget-password`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("OTP sent successfully");

      return response.data; // Assuming the response contains relevant data
    } catch (error) {
      toast.error("Failed to send OTP");
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to send OTP"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, newPassword, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/reset-password`,
        { email, newPassword, otp },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      return response.data; // Assuming the response contains relevant data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to reset password"
      );
    }
  }
);

// export const forwardPassword = createAsyncThunk(
//   'auth/forwardPassword',
//   async ({ email, newPassword }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         "/superadmin/cafe/reset-password",
//         { email, newPassword }
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       toast.success('Password reset successful'); 

//       return response.data;
//     } catch (error) {
//       toast.error('Password reset failed'); 

//       return rejectWithValue(
//         error.response?.data?.message ||
//           error.message ||
//           'Password reset failed'
//       );
//       }
//     }
//   );


export const forwardPassword1 = createAsyncThunk(
  "cafes/forwardPassword1",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, { email, newPassword }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status) {
        toast.success("Password reset successfully!");
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


    

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.authToken = action.payload.token;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.email = "";
      state.authToken = null;
      toast.success("Logged out successfully");
    },
    setPasswordResetEmail: (state, action) => {
      state.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendPasswordResetEmail.fulfilled, (state, action) => {
        // Handle success case, e.g., show a success message
      })
      .addCase(sendPasswordResetEmail.rejected, (state, action) => {
        state.error = action.payload; // Handle error case
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        // Handle success case, e.g., show a success message
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload; // Handle error case
      })
      .addCase(Adminlogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.email = action.payload.email;
        state.authToken = action.payload.token;
      })
      .addCase(Adminlogin.rejected, (state, action) => {
        state.error = action.payload; // Handle error case
      })
      // forwardPassword
      .addCase(forwardPassword1.fulfilled, (state, action) => {
        state.error = null;
        state.success = true;
      })
      .addCase(forwardPassword1.rejected, (state, action) => {
        state.error = action.payload;
        state.success = false;
      });
      
      
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setPasswordResetEmail,
} = authSlice.actions;

export default authSlice.reducer;
