import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { JOB_API_END_POINT } from '../components/utils/contants';
import { setallAdminJobs } from '../redux/jobSlice';

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/admin/jobs`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setallAdminJobs(res.data.jobs));
        }
      } catch (error) {
        console.log("Failed to fetch jobs:", error);
      }
    };

    fetchAllAdminJobs();
  }, [dispatch]);
};

export default useGetAllAdminJobs;
