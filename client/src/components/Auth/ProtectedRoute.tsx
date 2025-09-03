import { useAppSelector } from "@/store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { JSX } from "react/jsx-runtime";

interface ProtectedRouteProps {
  children: JSX.Element;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { accessToken, status } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "failed" || !accessToken) {
      navigate(redirectTo, { replace: true });
    }
  }, [accessToken, status, redirectTo, navigate]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!accessToken || status === "idle") {
    return null;
  }
  return children;
}
