import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}) => {
  const limits = [5, 10, 20];

  return (
    <div className="pagination">
      <div>
        <label>Задач на странице: </label>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}>
          {limits.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}>
          Назад
        </button>

        <span style={{ margin: "0 10px" }}>
          Страница {currentPage} из {totalPages}
        </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}>
          Вперед
        </button>
      </div>
    </div>
  );
};

export default Pagination;
