import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
} from "@reduxjs/toolkit";
import { authAPI } from "@/api/authAPI";
import axios from "axios";
import { AuthState } from "@/store/types";
import { RootState } from "./store";
import { AuthResponse, User } from "@/api/types";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle",
  error: null,
};

const hadndleError = (error: unknown): string => {
  if (axios.isAxiosError(error))
    return error.response?.data?.message || "Ошибка сервера";
  if (error instanceof Error) return error.message;
  return "Неизвестная ошибка";
};

export const register = createAsyncThunk(
  "auth/register",
  async (
    credentials: { email: string; password: string; age?: number },
    { rejectWithValue }
  ) => {
    try {
      return await authAPI.register(credentials);
    } catch (error) {
      return rejectWithValue(hadndleError(error));
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await authAPI.login(credentials);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadProfile = createAsyncThunk(
  "auth/loadProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = (getState() as RootState).auth;
      if (!accessToken) throw new Error("no token");
      return await authAPI.getProfile(accessToken);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    passwords: { oldPassword: string; newPassword: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.accessToken;
      if (!token) {
        throw new Error("No auth token");
      }

      const result = await authAPI.changePassword(token, passwords);
      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Password change failed"
      );
    }
  }
);

export const refreshTokens = createAsyncThunk(
  "auth/refreshTokens",
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const response = await authAPI.refreshTokens(refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Refresh failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    updateToken(state, action: PayloadAction<{ accessToken: string }>) {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.status = "succeeded";
      })
      .addMatcher(isPending(register, login, loadProfile), (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(
        isFulfilled(register, login),
        (state, action: PayloadAction<AuthResponse>) => {
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
          state.status = "succeeded";
          localStorage.setItem("accessToken", action.payload.accessToken);
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      )
      .addMatcher(
        isFulfilled(loadProfile),
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.status = "succeeded";
        }
      )
      .addMatcher(isRejected(register, login, loadProfile), (state, action) => {
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.error.message || "Request failed";
        state.status = "failed";
      });
  },
});

export const { logout, updateToken, clearError } = authSlice.actions;
export default authSlice.reducer;
