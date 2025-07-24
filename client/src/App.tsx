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

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const loadState = async () => {
      try {
        const response = await fetchTodos();
        setTodos(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadState();
  }, []);

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
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
