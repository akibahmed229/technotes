// internal imports
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

// external imports
import { apiSlice } from "../../app/api/apiSlice";

//T he code uses Redux Toolkit to create an adapter for notes data. The adapter has reducers and selectors for CRUD operations. The adapter sorts the notes by completed status.
const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

// The initial state of the notes data is created by the adapter.
const initialState = notesAdapter.getInitialState();

// The code uses Redux Toolkit Query to add new endpoints to an API slice. The code exports the updated API slice as notesApiSlice.
export const notesApiSlice = apiSlice.injectEndpoints({
  // The endpoints object defines the endpoints for the API slice.
  endpoints: (builder) => ({
    // getNotes is a query function that returns the notes data. The query function accepts a parameter that specifies the query parameters.
    getNotes: builder.query({
      query: () => ({
        url: "/notes",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        }, // validate the response status
      }),

      // The transformResponse function receives the response data as a string and returns the normalized state object.
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes); // set the normalized state object
      },

      // The providesTags function returns the tags that the query function adds to the store.
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else return [{ type: "Note", id: "LIST" }]; // tag for the list of notes
      },
    }),

    // addNewNote is a mutation function that adds a new note. The mutation function accepts a parameter that specifies the mutation parameters.
    addNewNote: builder.mutation({
      query: (initialNote) => ({
        url: "/notes",
        method: "POST",
        body: { ...initialNote },
      }),

      // The invalidatesTags function returns the tags that the mutation function adds to the store.
      invalidatesTags: [
        {
          type: "Note",
          id: "LIST",
        },
      ],
    }),

    // updateNote is a mutation function that updates an existing note. The mutation function accepts a parameter that specifies the mutation parameters.
    updateNote: builder.mutation({
      query: (initialNote) => ({
        url: "/notes",
        method: "PATCH",
        body: {
          ...initialNote,
        },
      }),

      // The invalidatesTags function returns the tags that the mutation function adds to the store.
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),

    // deleteNote is a mutation function that deletes an existing note. The mutation function accepts a parameter that specifies the mutation parameters.
    deleteNote: builder.mutation({
      query: (id) => ({
        url: "/notes",
        method: "DELETE",
        body: { id },
      }),

      // The invalidatesTags function returns the tags that the mutation function adds to the store.
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
  }),
});

// destructure the endpoints then export the endpoints
export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

// return the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState
);
