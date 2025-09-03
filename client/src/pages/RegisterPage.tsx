import { useNavigate, Link } from "react-router-dom";
import RegisterForm from "@/components/Auth/RegisterForm";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <h1>Sign Up</h1>
      <RegisterForm onSuccess={() => navigate("/")} />

      <p className="auth-link">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
}
