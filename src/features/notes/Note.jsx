// internal imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { memo } from "react";

// external imports
import { useGetNotesQuery } from "./notesApiSlice";

const Note = ({ noteId }) => {
  // this code retrieves a note object with a specific ID (noteId) from the Redux store, and assigns it to the note variable using the useGetNotesQuery hook and the selectFromResult function.
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId],
    }),
  });

  const navigate = useNavigate();

  // this code renders a table row with the note data, and a button to edit the note.
  if (note) {
    const created = new Date(note.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const updated = new Date(note.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const handleEdit = () => navigate(`/dash/notes/${noteId}`);

    return (
      <tr className="table__row">
        {/* this code renders a cell with the note status */}
        <td className="table__cell note__status">
          {note.completed ? (
            <span className="note__status--completed">Completed</span>
          ) : (
            <span className="note__status--open">Open</span>
          )}
        </td>

        {/* this code renders a cell with the note creation date, update date , note title & note username */}
        <td className="table__cell note__created">{created}</td>
        <td className="table__cell note__updated">{updated}</td>
        <td className="table__cell note__title">{note.title}</td>
        <td className="table__cell note__username">{note.username}</td>

        {/* this code renders a cell with a button to edit the note  */}
        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};

//The memoized version of the component will only re-render if its props have changed.
const memoizedNote = memo(Note); // Memoizes the Note component using memo from React.
export default memoizedNote;
