export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface PaginatedTodos {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  id: number;
  email: string;
  age?: number;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
}
