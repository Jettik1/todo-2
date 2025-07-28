import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
  type PaginatedTodos,
  type Todo,
} from "../api/todos";

interface TodoState {
  items: Todo[];
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  items: [],
  page: 1,
  limit: 10,
  totalPages: 1,
  isLoading: false,
  error: null,
};

export const fetchTodosThunk = createAsyncThunk(
  "todos/fetchTodos",
  async ({ page, limit }: { page: number; limit: number }) => {
    return await fetchTodos(page, limit);
  }
);

export const createTodoThunk = createAsyncThunk(
  "todos/createTodo",
  async (text: string, { getState }) => {
    const state = getState() as { todos: TodoState };
    const newTodo = await createTodo(text);
    return { todo: newTodo, page: state.todos.page, limit: state.todos.limit };
  }
);

export const toggleTodoThunk = createAsyncThunk(
  "todos/toggleTodo",
  async (id: number, { getState }) => {
    const state = getState() as { todos: TodoState };
    await updateTodo(id);
    return { page: state.todos.page, limit: state.todos.limit };
  }
);

export const deleteTodoThunk = createAsyncThunk(
  "todos/deleteTodo",
  async (id: number, { getState }) => {
    const state = getState() as { todos: TodoState };
    await deleteTodo(id);
    return { page: state.todos.page, limit: state.todos.limit };
  }
);

export const updateTodoTextThunk = createAsyncThunk(
  "todos/updateText",
  async ({ id, text }: { id: number; text: string }, { getState }) => {
    await updateTodo(id, { text });
    const state = getState() as { todos: TodoState };
    return { page: state.todos.page, limit: state.todos.limit };
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchTodosThunk.fulfilled,
        (state, action: PayloadAction<PaginatedTodos>) => {
          state.items = action.payload.data;
          state.totalPages = action.payload.totalPages;
          state.isLoading = false;
        }
      )
      .addCase(fetchTodosThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "failed to fetch todos";
      })
      .addCase(createTodoThunk.fulfilled, (state, action) => {
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(toggleTodoThunk.fulfilled, (state, action) => {
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(deleteTodoThunk.fulfilled, (state, action) => {
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      });
  },
});

export const { setPage, setLimit } = todoSlice.actions;
export default todoSlice.reducer;
