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
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  items: [],
  page: 1,
  limit: 10,
  total: 0,
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
  async (text: string) => {
    const newTodo = await createTodo(text);
    return newTodo;
  }
);

export const toggleTodoThunk = createAsyncThunk(
  "todos/toggleTodo",
  async (id: number) => {
    const updatedTodo = await updateTodo(id);
    return updatedTodo;
  }
);

export const deleteTodoThunk = createAsyncThunk(
  "todos/deleteTodo",
  async (id: number, { dispatch, getState }) => {
    await deleteTodo(id);
    const { todos } = getState() as { todos: TodoState };
    if (!todos) throw new Error("Todos state not found");
    const { page, limit } = todos;

    await dispatch(fetchTodosThunk({ page, limit }));

    return id;
  }
);

export const updateTodoTextThunk = createAsyncThunk(
  "todos/updateText",
  async ({ id, text }: { id: number; text: string }) => {
    const updatedTodo = await updateTodo(id, { text });
    return updatedTodo;
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
          state.total = action.payload.total;
          state.totalPages = action.payload.totalPages;
          state.isLoading = false;
        }
      )
      .addCase(fetchTodosThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "failed to fetch todos";
      })
      .addCase(createTodoThunk.fulfilled, (state, action) => {
        state.items = [
          action.payload,
          ...state.items.slice(0, state.limit - 1),
        ];
        if (state.items.length >= state.limit) {
          state.totalPages = Math.ceil((state.total + 1) / state.limit);
        }
        state.total += 1;
      })
      .addCase(toggleTodoThunk.fulfilled, (state, action) => {
        const updatedTodo = action.payload; // Данные с сервера
        const index = state.items.findIndex(
          (todo) => todo.id === updatedTodo.id
        );
        if (index !== -1) {
          state.items[index] = updatedTodo; // Точечное обновление
        }
      })
      .addCase(deleteTodoThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
        //fetchTodosThunk({page: state.page, limit: state.limit})
        state.total -= 1;
        state.totalPages = Math.ceil(state.total / state.limit);
        if (state.items.length === 0 && state.page > 1) {
          state.page -= 1;
        }
      })
      .addCase(updateTodoTextThunk.fulfilled, (state, action) => {
        const updatedTodo = action.payload; // Данные с сервера
        const index = state.items.findIndex(
          (todo) => todo.id === updatedTodo.id
        );
        if (index !== -1) {
          state.items[index] = updatedTodo; // Точечное обновление
        }
      });
  },
});

export const { setPage, setLimit } = todoSlice.actions;
export default todoSlice.reducer;
