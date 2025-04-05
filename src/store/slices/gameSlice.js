import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// const BASE_URL = process.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_API_URL;

// Async thunk to fetch games
export const getGames = createAsyncThunk(
  "games/getGames",
  async (CafeId, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/game/${CafeId}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);
// Async thunk to fetch a game by ID
export const getGameById = createAsyncThunk(
  "games/getGameById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/game/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to add a new game
export const addGame = createAsyncThunk(
  "games/addGame",
  async (gameData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/superadmin/game`,
        gameData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Game added successfully!");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to update an existing game
export const updateGame = createAsyncThunk(
  "games/updateGame",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/superadmin/game/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Game updated successfully!");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to delete a game
export const deleteGame = createAsyncThunk(
  "games/deleteGame",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/superadmin/game/${id}`);
      toast.success("Game deleted successfully!");
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);




const gameSlice = createSlice({
  name: "games",
  initialState: {
    games: [],
    selectedGame: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setSelectedGame(state, action) {
      state.selectedGame = action.payload;
    },
    updateGameTimeSlots(state, action) {
      const { index, timeSlots } = action.payload;
      if (state.games[index]) {
        state.games[index].timeSlots = timeSlots;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGames.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getGames.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.games = action.payload;
      })
      .addCase(getGames.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getGameById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getGameById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedGame = action.payload;
      })
      .addCase(getGameById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(addGame.fulfilled, (state, action) => {
        state.games.push(action.payload.data); // Assuming backend returns { data: game }
      })

      .addCase(updateGame.fulfilled, (state, action) => {
        const updatedGame = action.payload.data;
        const index = state.games.findIndex(
          (game) => game._id === updatedGame._id
        );
        if (index !== -1) {
          state.games[index] = updatedGame;
        }
        state.selectedGame = null; // Reset selected game after update
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.games = state.games.filter((game) => game.id !== action.payload);
      });
  },
});

export const { setSelectedGame, updateGameTimeSlots } = gameSlice.actions;

export default gameSlice.reducer;
