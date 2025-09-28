import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const token = useSelector((state: RootState) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
