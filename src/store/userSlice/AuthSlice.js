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
            const response = await axios.post(`${BASE_URL}/auth/user/login`, userData, {
                headers: { "Content-Type": "application/json" },
            });

            const { data } = response;

            if (!data || !data.data) {
                throw new Error("Invalid response structure from server");
            }
            toast.success("Login successful");
            localStorage.setItem("authToken", data.data.token);
            localStorage.setItem("userRole", "user");
            localStorage.setItem("user", JSON.stringify(data.data.user));

            return data.data;
        } catch (error) {
            toast.error("Login failed");

            return rejectWithValue(
                error.response?.data?.message || error.message || "Login failed"
            );
        }
    }
);


const authSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {
        userLoginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        userLoginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.email = action.payload.email;
            state.authToken = action.payload.token;
        },
        userLoginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        userLogout: (state) => {
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

    },
});

export const {
    userLoginStart,
    userLoginSuccess,
    userLoginFailure,
    userLogout,
    setPasswordResetEmail,
} = authSlice.actions;

export default authSlice.reducer;