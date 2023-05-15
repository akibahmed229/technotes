// internal imports
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

// external  imports
import { useAddNewUserMutation } from "./usersApiSlice";
import { ROLES } from "../../config/roles";
import useTitle from "../../hooks/useTitle";

// REGEX for usernames and passwords
const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserFrom = () => {
  useTitle("techNotes: New User");

  //:This code initializes a mutation function and its corresponding status variables for adding a new user.
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  // state for the form inputs
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);

  // This useEffect hook sets the validUsername state variable by checking if the username string matches the USER_REGEX pattern. It runs whenever the username variable changes.
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  // This useEffect hook sets the validPassword state variable by checking if the password string matches the PWD_REGEX pattern. It runs whenever the password variable changes.
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  // This useEffect hook sets the validRoles state variable by checking if the roles array has at least one role. It runs whenever the roles array changes.
  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]);

  // onUsernameChanged and onPasswordChanged functions are used to update the username and password state variables.
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  // This code defines a function that updates the roles state when a role is selected.
  const onRoleChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions, // HTMLCollection
      (option) => option.value
    );
    setRoles(values);
  };

  // This code checks if all the required form inputs are valid and if the addNewUser mutation is not loading.
  const canSave =
    [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

  // Define an asynchronous function to handle the click event of the save button, which will submit the form after validating the required fields such as the username, password, and roles. If the validation succeeds, it will call the addNewUser function to add a new user with the entered information.
  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, password, roles });
    }
  };

  // The code creates a list of option elements for each role and maps them into an array to be rendered as selectable roles.
  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  // classes for the error message
  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPwdClass = !validPassword ? "form__input--incomplete" : "";
  const validRolesClass = !Boolean(roles.length)
    ? "form__input--incomplete"
    : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveUserClicked}>
        {/* div for the title row and action buttons. This div is used to separate the title row from the form inputs. */}
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        {/* lable for  input element. */}
        <label className="form__input" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />

        <label className="form__input" htmlFor="password">
          Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />

        <label className="form__input" htmlFor="roles">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <select
          className={`form__select ${validRolesClass}`}
          id="roles"
          name="roles"
          multiple={true}
          size={3}
          value={roles}
          onChange={onRoleChanged}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
};

export default NewUserFrom;
