// internal imports
import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";

// external imports
import { useRefreshMutation } from "./authApiSlice";
import { selectCurrentToken } from "./authSlice";
import usePersist from "../../hooks/usePersist";

const PersistLogin = () => {
  const [persist] = usePersist(); // true or false
  const token = useSelector(selectCurrentToken); // token
  const effectRan = useRef(false); // to prevent infinite loop

  // for success
  const [trueSuccess, setTrueSuccess] = useState(false);

  // for refresh token
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  // for refresh token
  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      // react 18 strict mode

      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          // const response =
          await refresh(); // {accessToken: "new token"}
          // const {accessToken} = response.data
          setTrueSuccess(true);
        } catch (error) {
          console.error(error);
        }
      };

      if (!token && persist) verifyRefreshToken(); // persist: yes, token: no
    }

    return () => (effectRan.current = true); // prevent infinite loop
  }, []);

  let content;

  if (!persist) {
    // persist: no
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    // persist: yes, token: no
    console.log("loading");
    content = <PulseLoader color={"FFF"} />;
  } else if (isError) {
    // persist:yes, token: no
    console.log("error");
    content = (
      <p className="errmsg">
        {`${error?.data?.message} - `}
        <Link to="/login">Please login again</Link>
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    // persist: yes, token: yes
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    // persist: yes, token: yes
    console.log("token and uninitialized");
    console.log(isUninitialized);
    content = <Outlet />;
  }
  return content;
};

export default PersistLogin;
