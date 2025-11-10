import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tables: [],
  selectedTable: null,
};

const tableSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    addTable: (state, action) => {
      state.tables.push(action.payload);
    },
    updateTable: (state, action) => {
      const { index, table } = action.payload;
      state.tables[index] = table;
    },
    deleteTable: (state, action) => {
      state.tables = state.tables.filter((_, i) => i !== action.payload);
    },
    setSelectedTable: (state, action) => {
      state.selectedTable = action.payload;
    },
  },
});

export const { addTable, updateTable, deleteTable, setSelectedTable } = tableSlice.actions;
export default tableSlice.reducer; 