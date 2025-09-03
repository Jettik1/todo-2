import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { changePassword } from "@/store/authSlice";

const passwordSchema = yup.object({
  oldPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

type PasswordFormData = yup.InferType<typeof passwordSchema>;

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema) as Resolver<PasswordFormData>,
  });

  const onSubmit = (data: PasswordFormData) => {
    setError("");
    setSuccess("");

    dispatch(
      changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
    )
      .unwrap()
      .then(() => {
        setSuccess("Password changed successfully");
        reset();
      })
      .catch((err) => {
        setError(err || "Password change failed");
      });
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>

      <div className="user-info">
        <h2>Account Information</h2>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        {user?.age && (
          <p>
            <strong>Age:</strong> {user.age}
          </p>
        )}
        <p>
          <strong>Registered:</strong>{" "}
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "N/A"}
        </p>
      </div>

      <div className="change-password">
        <h2>Change Password</h2>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="password"
              placeholder="Current Password"
              {...register("oldPassword")}
            />
            {errors.oldPassword && (
              <span className="error">{errors.oldPassword.message}</span>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="New Password"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <span className="error">{errors.newPassword.message}</span>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
