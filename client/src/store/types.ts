import type { Todo, User } from "@/api/types";

export interface TodoState {
  items: Todo[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
