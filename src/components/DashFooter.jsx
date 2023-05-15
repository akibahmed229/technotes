// internal imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

// external imports
import useAuth from "../hooks/useAuth";

const DashFooter = () => {
  // geting the current user and status
  const { username, status } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation(); // getting the current path name of the page

  const onGoHomeClicked = () => navigate("/dash"); // navigate to home page

  let goHomeButton = null;
  // if the current path is not /dash then show the goHomeButton
  if (pathname !== "/dash") {
    goHomeButton = (
      <button
        className="dash-dash-footer__button icon-button "
        title="Home"
        onClick={onGoHomeClicked}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
    );
  }

  const content = (
    <footer className="dash-footer">
      {goHomeButton}
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  );

  return content;
};

export default DashFooter;
