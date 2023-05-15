// internal imports
import PulseLoader from "react-spinners/PulseLoader";

// external imports
import Note from "./Note";
import { useGetNotesQuery } from "./notesApiSlice";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const NotesList = () => {
  useTitle("techNotes: Notes List");

  // get the username from the auth
  const { username, isManager, isAdmin } = useAuth();

  // get the notes from the api
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  // display the loader
  if (isLoading) content = <PulseLoader color="#fff" />;

  // display the error message
  if (isError) {
    content = (
      <p className={isError ? "errmsg" : "offscreen"}>{error?.data?.message}</p>
    );
  }

  // display the notes
  if (isSuccess) {
    const { ids, entities } = notes; // destructure the notes

    // to store the filtered ids
    let filteredIds;
    if (isManager || isAdmin) {
      filteredIds = [...ids]; // clone the ids
    } else {
      filteredIds = ids.filter(
        (noteID) => entities[noteID].username === username
      ); // filter the ids
    }

    const tableContent =
      ids?.length &&
      filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />); // map the ids then send to note component

    content = (
      // display the table
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">
              Username
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Updated
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Owner
            </th>
            <th scope="col" className="table__th note__edit">
              Edit
            </th>
          </tr>
        </thead>
        {/* display the notes */}
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};

export default NotesList;
