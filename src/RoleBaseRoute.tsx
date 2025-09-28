import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Props {
  children: JSX.Element;
  roles?: 'admin';
}

export default function RoleBasedRoute({ children, roles }: Props) {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && (!user || !roles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
