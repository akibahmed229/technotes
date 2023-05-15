// internal imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { memo } from "react";

// external imports
import { useGetUsersQuery } from "./usersApiSlice";

const User = ({ userId }) => {
  // Fetches user data based on the userId parameter using useGetUsersQuery() hook and extracts the user object from the response using the selectFromResult function. The extracted user object is stored in the user variable using destructuring assignment.
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  const navigate = useNavigate();

  // If the user object exists, it renders the user data in the table. If not, it renders nothing.
  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`); // Navigates to the user edit page

    const userRolesString = user.roles.toString().replaceAll(",", ", "); // Converts the user roles array to a string and replaces all commas with a comma and space

    const cellStatus = user.active ? "" : "table__cell--inactive"; // If the user is active, it renders the user data in the table. If not, it renders the user data in the table with a different color.

    return (
      <tr className="table__row user">
        {/* renders the user data in the table */}
        <td className={`table__cell ${cellStatus}`}>{user.username}</td>
        <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
        <td className={`table__cell ${cellStatus}`}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};

//The memoized version of the component will only re-render if its props have changed.
const memoizedUser = memo(User); // Memoizes the User component using memo from React.
export default memoizedUser;
