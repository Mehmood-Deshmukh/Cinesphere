import { createSlice } from "@reduxjs/toolkit";

//getConfiguration - For getting the initial part of Image URL's
//getGenres - To get the genres of movies and tv shows

export const sliceHome = createSlice({
  name: "home",
  initialState: {
    url: {},
    genres: {},
  },
  reducers: {
    getConfiguration: (state, action) => {
      state.url = action.payload;
    },
    getGenres: (state, action) => {
      state.genres = action.payload;
    },
  },
});

export const { getConfiguration, getGenres } = sliceHome.actions;

export default sliceHome.reducer;
