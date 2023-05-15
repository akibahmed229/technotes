// internal imports
import { useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

// external imports
import { useGetUsersQuery } from "../users/usersApiSlice";
import EditNoteForm from "./EditNoteForm";
import { useGetNotesQuery } from "./notesApiSlice";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const EditNote = () => {
  useTitle("techNotes: Edit Note");

  const { id } = useParams(); // get id from url

  const { username, isManager, isAdmin } = useAuth(); // get user info

  // The useGetNotesQuery hook retrieves notes data from the server and uses the selectFromResult option to extract the note with the given id from the data object returned by the query.
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id],
    }),
  });

  // The useGetUsersQuery hook retrieves users data from the server and uses the selectFromResult option to map over the ids array in the data object and return an array of user objects with the corresponding ids.
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  // If the note or users data is not yet loaded, return a loading indicator.
  if (!note || !users?.length) return <PulseLoader color="#FFF" />;

  // If the note is not owned by the current user, return an error message.
  if (!isManager && !isAdmin) {
    if (note.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  // If the note is owned by the current user, return the form.
  const content = <EditNoteForm note={note} users={users} />; // pass note and users to form

  return content;
};

export default EditNote;
