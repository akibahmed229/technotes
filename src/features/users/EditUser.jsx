// internal imports
import { useParams } from "react-router-dom";
import EditUserForm from "./EditUserForm";
import PulseLoader from "react-spinners/PulseLoader";

// external imports
import { useGetUsersQuery } from "./usersApiSlice";
import useTitle from "../../hooks/useTitle";

const EditUser = () => {
  useTitle("techNotes: Edit User");

  const { id } = useParams(); // get id from url

  // Retrieve data about a specific user from the API using the useGetUsersQuery hook and extract the user object using the id property and the selectFromResult option.
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  // If the user object is not found, return a loading indicator.
  if (!user) return <PulseLoader color={"#FFF"} />;

  // Otherwise, return the EditUserForm component with the user object as a prop.
  const content = <EditUserForm user={user} />;

  return content;
};

export default EditUser;
