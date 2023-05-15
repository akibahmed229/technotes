// internal imports
import { useLocation, Navigate, Outlet } from "react-router-dom";

// external imports
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation(); // used to get the current location of the user
  const { roles } = useAuth(); // used to get the roles of the user

  // if the user is not logged in then redirect to login page
  const content = roles.some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );

  return content;
};

export default RequireAuth;
