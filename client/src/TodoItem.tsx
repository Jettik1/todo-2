import { useState } from "react";
import { type Todo } from "./api/todos";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateText: (id: number, text: string) => void;
}

const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  onUpdateText,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim() && editText !== todo.text) {
      onUpdateText(todo.id, editText);
    }
    setIsEditing(false);
  };

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />

      {isEditing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          <button onClick={handleSave}>save</button>
        </>
      ) : (
        <>
          <span>{todo.text}</span>
          <button onClick={() => setIsEditing(true)}>edit</button>
        </>
      )}

      <button
        onClick={() => onDelete(todo.id)}
        aria-label={`Удалить "${todo.text}"`}
        style={{ color: "red" }}>
        ×
      </button>
    </li>
  );
};

export default TodoItem;
