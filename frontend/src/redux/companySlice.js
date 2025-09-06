import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { JOB_API_END_POINT } from "../components/utils/contants";

const companySlice = createSlice({
  name: "company",
  initialState: {
    singleCompany: null,
    companies: [],
    searchCompanyByText: "",
  },
  reducers: {
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    setSearchCompanyByText: (state, action) => {
      state.searchCompanyByText = action.payload;
    },
    deleteCompanyFromState: (state, action) => {
      state.companies = state.companies.filter(
        (company) => company._id !== action.payload
      );
    },
  },
});

// ✅ Thunk to fetch companies from API
export const fetchCompaniesAction = () => async (dispatch) => {
  try {
    const res = await axios.get(`${JOB_API_END_POINT}/get`, {
      withCredentials: true,
    });
    if (res.data.success) {
      dispatch(setCompanies(res.data.companies || []));
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
};

export const {
  setSingleCompany,
  setCompanies,
  setSearchCompanyByText,
  deleteCompanyFromState,
} = companySlice.actions;

export default companySlice.reducer;
