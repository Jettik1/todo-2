import { useState } from "react";

export interface TodoFormProps {
  onCreate: (text: string) => Promise<void>;
}

const TodoForm: React.FC<TodoFormProps> = ({ onCreate }) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    try {
      await onCreate(inputValue);
      setInputValue("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
        disabled={isLoading}
        className="todo-input"
      />

      <button
        type="submit"
        disabled={!inputValue.trim() || isLoading}
        className="add-button">
        {isLoading ? "Добавляем задачу..." : "Добавить"}
      </button>
    </form>
  );
};

export default TodoForm;
