import { Link, useNavigate } from "react-router-dom";
import LoginForm from "@/components/Auth/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <h1>Sign In</h1>
      <LoginForm onSuccess={() => navigate("/")} />
      <p className="auth-link">
        Don't have account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
