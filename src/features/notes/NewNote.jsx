// internal imports
import PulseLoader from "react-spinners/PulseLoader";

// external imports
import NewNoteForm from "./NewNoteForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useTitle from "../../hooks/useTitle";

const NewNote = () => {
  useTitle("techNotes: New Note");

  // The useGetUsersQuery hook retrieves users data from the server and uses the selectFromResult option to map over the ids array in the data object and return an array of user objects with the corresponding ids.
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  // If the users array is empty, return a PulseLoader component.
  if (!users?.length) return <PulseLoader color={"#FFF"} />;

  // If the users array is not empty, return the NewNoteForm component.
  const content = <NewNoteForm users={users} />;

  return content;
};

export default NewNote;
