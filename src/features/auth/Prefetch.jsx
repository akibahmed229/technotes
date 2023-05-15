// internal imports
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

// external imports
import { usersApiSlice } from "../users/usersApiSlice";
import { store } from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      notesApiSlice.util.prefetch("getNotes", "notesList", { force: true })
    ); // prefetches the notes list on app load
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    ); // prefetches the users list on app load
  }, []);

  return <Outlet />; // renders the children components
};

export default Prefetch;
