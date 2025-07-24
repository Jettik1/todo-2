import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
  type Todo,
} from "./api/todos";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import Pagination from "./Pagination";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const loadState = async (page: number, limit: number) => {
    try {
      const response = await fetchTodos(page, limit);
      setTodos(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadState(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleNewTodo = async (text: string) => {
    const newTodo = await createTodo(text);
    console.log(newTodo);
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = async (id: number) => {
    try {
      const updatedTodo = await updateTodo(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      setTodos((prev) => prev.filter((todo) => todo.id != id));
      await deleteTodo(id);
      await loadState(pagination.page, pagination.limit);
    } catch (error) {
      console.error(error);
      setTodos(todos);
    }
  };

  const updateTodoText = async (id: number, newText: string) => {
    try {
      const updatedTodo = await updateTodo(id, { text: newText });
      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Тудушки</h1>
      <TodoForm onCreate={handleNewTodo} />
      <div className="card">
        {todos.length > 0 ? (
          <ul>
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={removeTodo}
                onUpdateText={updateTodoText}
              />
            ))}
          </ul>
        ) : (
          <p>Add what a todo!</p>
        )}
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        limit={pagination.limit}
        onLimitChange={handleLimitChange}
      />

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
