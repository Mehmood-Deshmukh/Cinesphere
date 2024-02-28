import { configureStore } from "@reduxjs/toolkit";
import sliceHome from "./sliceHome";
export const store = configureStore({
  reducer: {
    home: sliceHome,
  },
});
