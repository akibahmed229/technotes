// internal exports
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";

// external imports
import { selectCurrentToken } from "../features/auth/authSlice";

// useAuth provides authentication-related information about the current user and their role within the application.
const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let status = "Employee";

  // If a token exists, decode it and return the username, roles, and status.
  if (token) {
    const decode = jwtDecode(token); // decode token
    const { username, roles } = decode.UserInfo; // extract username and roles from token

    isManager = roles.includes("Manager");
    isAdmin = roles.includes("Admin");

    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";

    return { username, roles, isManager, isAdmin, status };
  }

  return { username: "", roles: [], isManager, isAdmin, status };
};

export default useAuth;
