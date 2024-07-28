import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  movies: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.movieId !== action.payload);
    },
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, setMovies } = cartSlice.actions;
export default cartSlice.reducer;
