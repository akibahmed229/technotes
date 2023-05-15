// internal imports
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// external imports
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const Welcome = () => {
  // setting the page title
  useTitle("techNote: Dash Board");

  // getting the user data
  const { username, isManager, isAdmin } = useAuth();

  // getting the current date and time
  const [today, setToday] = useState(
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "long",
    }).format(new Date())
  );

  // updating the current date and time
  useEffect(() => {
    const interval = setInterval(() => {
      setToday(
        new Intl.DateTimeFormat("en-US", {
          dateStyle: "full",
          timeStyle: "long",
        }).format(new Date())
      );
    }, 1000);

    return () => clearInterval(interval); // cleanup function
  }, []);

  const content = (
    <section className="welcome">
      <p>{today}</p>

      <h1>Welcome {username}</h1>

      <p>
        <Link to="/dash/notes">View TechNotes</Link>
      </p>

      <p>
        <Link to="/dash/notes/new">Add New TechNote</Link>
      </p>

      {(isManager || isAdmin) && (
        <p>
          <Link to="/dash/users">View User Setting</Link>
        </p>
      )}

      {(isManager || isAdmin) && (
        <p>
          <Link to="/dash/users/new">Add New User</Link>
        </p>
      )}
    </section>
  );

  return content;
};

export default Welcome;
