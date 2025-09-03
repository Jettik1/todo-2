import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import toDoListSVG from "@/assets/to-do-list-svgrepo-com.svg";
import "@/App.css";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Navbar from "./components/Auth/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <img src={toDoListSVG} className="logo" alt="Todo App Logo" />
        </a>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Добавляем маршрут */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>

      <p className="read-the-docs">
        Todo App - управляйте своими задачами эффективно
      </p>
    </>
  );
}

export default App;
