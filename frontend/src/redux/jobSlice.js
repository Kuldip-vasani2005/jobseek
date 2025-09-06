import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
    savedJobs: [], // 🔥 new state
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setallAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },

    // 🔥 Save Jobs Feature
    saveJob: (state, action) => {
      const job = action.payload;
      // Prevent duplicate saves
      if (!state.savedJobs.find((j) => j._id === job._id)) {
        state.savedJobs.push(job);
      }
    },
    removeSavedJob: (state, action) => {
      state.savedJobs = state.savedJobs.filter(
        (job) => job._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase("auth/logout", () => ({
      allJobs: [],
      allAdminJobs: [],
      singleJob: null,
      searchJobByText: "",
      searchedQuery: "",
      allAppliedJobs: [],
      savedJobs: [], // ✅ clear saved jobs on logout
    }));
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setallAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  saveJob,        // ✅ export
  removeSavedJob, // ✅ export
} = jobSlice.actions;

export default jobSlice.reducer;
