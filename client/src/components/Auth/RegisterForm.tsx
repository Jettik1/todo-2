import { useAppDispatch, useAppSelector } from "@/store/store";
import { register } from "@/store/authSlice";
import * as yup from "yup";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { clearError } from "@/store/authSlice";

interface RegisterFormProps {
  onSuccess?: () => void;
}

const registerSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  age: yup
    .number()
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120")
    .optional(),
});

type RegisterFormData = {
  password: string;
  email: string;
  confirmPassword: string;
  age?: number;
};

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const dispatch = useAppDispatch();
  const { error: authError, status } = useAppSelector((state) => state.auth);
  /* const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState(""); */

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as Resolver<RegisterFormData>,
  });

  useEffect(() => {
    const subscription = watch(() => {
      if (authError) {
        dispatch(clearError());
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, authError, dispatch]);

  const onSubmit = (data: RegisterFormData) => {
    dispatch(
      register({
        email: data.email,
        password: data.password,
        age: data.age || undefined,
      })
    )
      .unwrap()
      .then(() => onSuccess?.());
  };

  return (
    <div className="register-form">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input {...formRegister("email")} placeholder="Email" />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div>
          <input
            type="password"
            {...formRegister("password")}
            placeholder="Password"
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <div>
          <input
            type="password"
            {...formRegister("confirmPassword")}
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <span>{errors.confirmPassword.message}</span>
          )}
        </div>

        <div>
          <input type="number" {...formRegister("age")} placeholder="Age" />
        </div>

        {authError && <div className="error">{authError}</div>}

        <button type="submit" disabled={status === "loading"}>
          {isSubmitting ? "Registation" : "Register"}
        </button>
      </form>
    </div>
  );
}
