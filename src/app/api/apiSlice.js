// internal imports
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// external imports
import { setCredentials } from "../../features/auth/authSlice";

// this code sets up a baseQuery object for making authenticated HTTP requests to a server.
const baseQuery = fetchBaseQuery({
  // baseUrl: "http://localhost:3500",
  baseUrl: "https://technotes-api-5gcn.onrender.com",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token; // get token from state

    if (token) {
      headers.set("authorization", `Bearer ${token}`); // set token
    }
    return headers;
  },
});

// the baseQueryWithReauth function handles requests with authentication by automatically refreshing the access token if it has expired.
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // console.log(args) // request url, method, body
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions); // call baseQuery

  // If you want, handle other status codes, too
  if (result?.error?.status === 403) {
    console.log("sending refresh token");

    // send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // if refresh token is not valid, logout user
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired.";
      }
      return refreshResult;
    }
  }

  return result;
};

// the apiSlice object is used for managing API state and making requests.
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});
