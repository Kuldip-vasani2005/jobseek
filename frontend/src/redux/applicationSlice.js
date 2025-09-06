import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applicants: [],   // ✅ will hold all applicants of a job
  },
  reducers: {
    setAllApplicants: (state, action) => {
      state.applicants = action.payload;
    },
    updateApplicantStatus: (state, action) => {
      const { applicantId, status } = action.payload;
      state.applicants = state.applicants.map((app) =>
        app._id === applicantId ? { ...app, status } : app
      );
    },
    clearApplicants: (state) => {
      state.applicants = [];
    },
  },
});

export const { setAllApplicants, updateApplicantStatus, clearApplicants } =
  applicationSlice.actions;

export default applicationSlice.reducer;
