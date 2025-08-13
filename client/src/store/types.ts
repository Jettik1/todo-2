import type { Todo } from "@/api/types";

export interface TodoState {
  items: Todo[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}
