import axios from "axios";
import type { PaginatedTodos, Todo } from "@/api/types";

const API_URL = "http://localhost:3001";

export const fetchTodos = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedTodos> => {
  const response = await axios.get(`${API_URL}/todos`, {
    params: { page, limit },
  });
  return response.data;
};

export const createTodo = async (text: string): Promise<Todo> => {
  const response = await axios.post(`${API_URL}/todos`, { text });
  return response.data;
};

export const updateTodo = async (
  id: number,
  updates?: Partial<{ text: string; completed: boolean }>
): Promise<Todo> => {
  const response = updates
    ? await axios.put(`${API_URL}/todos/${id}`, updates)
    : await axios.patch(`${API_URL}/todos/${id}/toggle`);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/todos/${id}`);
};
