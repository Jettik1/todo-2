import axios from "axios";

const API_URL = "http://localhost:3001";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface PaginatedTodos {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

export const updateTodo = async (id: number): Promise<Todo> => {
  const response = await axios.patch(`${API_URL}/todos/${id}`);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/todos/${id}`);
};
