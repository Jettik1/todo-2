import { useState } from "react";
import { createTodoThunk } from "@/store/todoSlice";
import { useAppDispatch } from "@/store/store";

export interface TodoFormProps {
  onCreate: (text: string) => Promise<void>;
}

const TodoForm = () => {
  const [inputValue, setInputValue] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch(createTodoThunk(inputValue));
      setInputValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <label htmlFor="todo-input" className="sr-only">
        Новая задача
      </label>
      <input
        id="todo-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Текст задачи"
        className="todo-input"
      />

      <button type="submit" className="add-button"></button>
    </form>
  );
};

export default TodoForm;
