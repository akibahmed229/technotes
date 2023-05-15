// internal imports
import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

// injectEndpoints is a function that takes a config object and returns an object with endpoints
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // login is a mutation that takes credentials and returns an object with the user
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    // logout is a mutation that takes no arguments and returns nothing
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // onQueryStarted is a function that takes an argument and returns a function
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled; // data is the user
          console.log(data);
          dispatch(logOut()); // dispatch the logout action
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState()); // reset the api state
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),

    // refresh is a mutation that takes no arguments and returns an object with the use
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      // onQueryStarted is a function that takes an argument and returns a function
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled; // data is the user
          console.log(data);
          const { accessToken } = data; // get the accessToken from the data
          dispatch(setCredentials({ accessToken })); // dispatch the setCredentials action
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;
