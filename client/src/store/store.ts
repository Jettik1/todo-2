import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "@/store/todoSlice";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authReducer from "@/store/authSlice";

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
