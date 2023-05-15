// internal imports
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

// external imports
import { apiSlice } from "../../app/api/apiSlice";

// The above code creates an entity adapter for managing entities in the Redux store.
const usersAdapter = createEntityAdapter({});

// This code initializes the initial state for the user entities using the getInitialState() method of the entity adapter and sets it to an empty object.
const initialState = usersAdapter.getInitialState();

// The code uses Redux Toolkit Query to add new endpoints to an API slice. The code exports the updated API slice as usersApiSlice.
export const usersApiSlice = apiSlice.injectEndpoints({
  // The endpoints object defines the endpoints for the API slice.
  endpoints: (builder) => ({
    // getUsers is a query endpoint that returns the users data.
    getUsers: builder.query({
      query: () => ({
        url: "/users",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),

      // The transformResponse function is used to modify the response data before it is returned by the query.
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers); // setAll() method sets the entire state.
      },

      // The providesTags function is used to provide the tags for the query result.
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }]; // LIST is used to invalidate the query result.
      },
    }),

    // addNewUser is a mutation endpoint that adds a new user.
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),

      // invalidatesTags is used to invalidate the query result.
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // updateUser is a mutation endpoint that updates an existing user.
    updateUser: builder.mutation({
      query: (initaalUserData) => ({
        url: `/users`,
        method: "PATCH",
        body: {
          ...initaalUserData,
        },

        // invalidatesTags is used to invalidate the query result.
        invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
      }),
    }),

    // deleteUser is a mutation endpoint that deletes an existing user.
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users`,
        method: "DELETE",
        body: { id },
      }),

      // invalidatesTags is used to invalidate the query result.
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

// These are the hooks that we will use to call the above endpoints.
export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

// return the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
