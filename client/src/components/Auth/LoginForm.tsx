import { useAppDispatch, useAppSelector } from "@/store/store";
import { clearError, login } from "@/store/authSlice";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface LoginFormProps {
  onSuccess?: () => void;
}
type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });
  const dispatch = useAppDispatch();
  const { error: authError, status } = useAppSelector((state) => state.auth);
  /* const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); */

  const onSubmit = (data: LoginFormData) => {
    dispatch(login(data))
      .unwrap()
      .then(() => onSuccess?.());
  };

  useEffect(() => {
    const subscription = watch(() => {
      if (authError) {
        dispatch(clearError());
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, authError, dispatch]);

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input {...register("email")} placeholder="Email" />
          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>

        {authError && <div className="error">{authError}</div>}

        <button type="submit" disabled={status === "loading"}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
