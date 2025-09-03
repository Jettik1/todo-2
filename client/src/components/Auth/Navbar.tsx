import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { logout } from "@/store/authSlice";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Todo App</Link>
      </div>

      <div className="nav-links">
        {accessToken ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/profile">Profile</Link>
            <span className="user-email">{user?.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
