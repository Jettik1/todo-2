import { useEffect } from "react";
import toDoListSVG from "@/assets/to-do-list-svgrepo-com.svg";
import reactLogo from "@/assets/react.svg";
import "@/App.css";
import TodoForm from "@/TodoForm";
import TodoItem from "@/TodoItem";
import Pagination from "@/Pagination";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  deleteTodoThunk,
  fetchTodosThunk,
  setLimit,
  setPage,
  toggleTodoThunk,
  updateTodoTextThunk,
} from "@/store/todoSlice";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: todos,
    page,
    limit,
    totalPages,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.todos);

  useEffect(() => {
    dispatch(fetchTodosThunk({ page, limit }));
  }, [dispatch, page, limit]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
  };

  const handleToggle = (id: number) => {
    dispatch(toggleTodoThunk(id));
  };

  const handleRemoveTodo = async (id: number) => {
    dispatch(deleteTodoThunk(id));
  };

  const habdleUpdateTodoText = async (id: number, newText: string) => {
    dispatch(updateTodoTextThunk({ id, text: newText }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div>
        <a href="" target="_blank">
          <img src={toDoListSVG} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Тудушки</h1>
      <TodoForm />
      <div className="card">
        {todos.length > 0 ? (
          <ul>
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleRemoveTodo}
                onUpdateText={habdleUpdateTodoText}
              />
            ))}
          </ul>
        ) : (
          <p>Add what a todo!</p>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        limit={limit}
        onLimitChange={handleLimitChange}
      />

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
