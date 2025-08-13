import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "@/store/todoSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
