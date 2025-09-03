import axios from "axios";
import { AuthResponse, User } from "@/api/types";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAPI = {
  async register(credentials: {
    email: string;
    password: string;
    age?: number;
  }): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/register",
        credentials
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Registration failed");
      }
      throw error;
    }
  },

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Invalid email or password");
        } else if (error.response?.status === 400) {
          throw new Error(error.response?.data?.message || "Validation error");
        } else {
          throw new Error(error.response?.data?.message || "Login failed");
        }
      }
      throw new Error("Network error");
    }
  },

  async getProfile(token: string): Promise<User> {
    const response = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async changePassword(
    token: string,
    passwords: { oldPassword: string; newPassword: string }
  ): Promise<string> {
    const response = await api.post("/auth/change-password", passwords, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return `status is: ${response.status}`;
  },

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await api.post<{ accessToken: string }>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post("/auth/logout", { refreshToken });
  },
};
