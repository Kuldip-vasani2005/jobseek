import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "../../redux/applicationSlice";
import { APPLICATION_API_END_POINT } from "../utils/contants";
import { motion } from "framer-motion";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchALLApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true }
        );

        dispatch(setAllApplicants(res.data.job.applications));
      } catch (error) {
        console.log(error);
      }
    };

    fetchALLApplicants();
  }, [params.id, dispatch]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-30 animate-gradient-x"></div>

      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 5 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-7xl mx-auto my-10 bg-white/80 backdrop-blur-md border border-purple-200 rounded-3xl shadow-2xl p-6 transform-gpu hover:scale-[1.02] hover:rotate-1 transition-all duration-500"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-700 drop-shadow-lg">
          Applicants ({applicants?.length || 0})
        </h1>

        {/* Applicants Table */}
        <ApplicantsTable />
      </motion.div>
    </div>
  );
};

export default Applicants;
