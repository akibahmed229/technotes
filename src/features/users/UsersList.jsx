// internal imports
import PulseLoader from "react-spinners/PulseLoader";

// external imports
import useTitle from "../../hooks/useTitle";
import User from "./User";
import { useGetUsersQuery } from "./usersApiSlice";

const UsersList = () => {
  useTitle("techNotes: Users List");

  // fetch users list from api
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
    // custom query name
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000, // poll for every 60 seconds
    refetchOnFocus: true, // refetch on tab focus
    refetchOnMountOrArgChange: true, // refetch on mount or argument change
  });

  let content;

  // if loading show loader
  if (isLoading) content = <PulseLoader color={"FFf"} />;

  // if error show error message
  if (isError) {
    content = (
      <p className={isError ? "errmsg" : "offscreen"}>{error?.data?.message}</p>
    );
  }

  // if success show users list
  if (isSuccess) {
    const { ids } = users;

    // map users list to table content
    const tableContent =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user_username">
              Username
            </th>
            <th scope="col" className="table__th user_roles">
              Roles
            </th>
            <th scope="col" className="table__th user_edit">
              Edit
            </th>
          </tr>
        </thead>
        {/* display table content */}
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};

export default UsersList;
