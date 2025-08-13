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
