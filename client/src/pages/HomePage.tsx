import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import TodoForm from "@/components/TodoForm";
import TodoItem from "@/components/TodoItem";
import Pagination from "@/components/Pagination";
import {
  deleteTodoThunk,
  fetchTodosThunk,
  setLimit,
  setPage,
  toggleTodoThunk,
  updateTodoTextThunk,
} from "@/store/todoSlice";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const {
    items: todos,
    page,
    limit,
    totalPages,
    isLoading,
    error,
  } = useAppSelector((state) => state.todos);

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

  const handleRemoveTodo = (id: number) => {
    dispatch(deleteTodoThunk(id));
  };

  const handleUpdateTodoText = (id: number, newText: string) => {
    dispatch(updateTodoTextThunk({ id, text: newText }));
  };

  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken) {
      navigate("/register");
    }
  }, [accessToken, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="home-page">
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
                onUpdateText={handleUpdateTodoText}
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
    </div>
  );
}
