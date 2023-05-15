// internal imports
import { Routes, Route } from "react-router-dom";

// external imports
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserFrom from "./features/users/NewUserFrom";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";
import ErrorPage from "./components/ErrorPage";

function App() {
  useTitle("TechNote Repaires");

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="*" element={<ErrorPage />} />

        {/* Public Routes  */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Procted Routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                {/* Users Routes  */}
                <Route
                  element={
                    <RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />
                  }
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserFrom />} />
                  </Route>
                </Route>

                {/* Notes Routes  */}
                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>

                {/* End of DashLayout */}
              </Route>
            </Route>
          </Route>
          {/* End of Procted Routes */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
