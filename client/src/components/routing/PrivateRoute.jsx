import { Navigate } from "react-router-dom";
import { useSelector } from "../../store";
import { selectUser } from "../../selectors";

export const PrivateRoute = ({ children }) => {
  const user = useSelector(selectUser);

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

