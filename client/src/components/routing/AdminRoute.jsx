import { Navigate } from "react-router-dom";
import { useSelector } from "../../store";
import { selectUser, selectUserRole } from "../../selectors";
import { ROLE } from "../../constants";

export const AdminRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const roleId = useSelector(selectUserRole);

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  if (roleId !== ROLE.ADMIN) {
    return <Navigate to="/" replace />;
  }

  return children;
};

