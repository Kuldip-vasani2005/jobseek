import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "../redux/jobSlice";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    if (!query.trim()) return;
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <motion.div
      className="text-center py-20 bg-gray-100 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col gap-8 my-10">
        {/* Tagline */}
        <motion.span
          className="mx-auto px-6 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold shadow-sm"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          🚀 No. 1 Job Seeker Platform
        </motion.span>

        {/* Heading */}
        <motion.h1
          className="text-5xl font-extrabold leading-snug text-gray-900"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
        >
          Search, Apply & <br /> Get Your{" "}
          <span className="text-indigo-600">Dream Job</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="max-w-2xl mx-auto font-medium text-gray-600"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          A Job Seeker is a digital platform that connects job seekers with
          employers. It allows candidates to search, apply, and track job
          opportunities while enabling recruiters to post vacancies, manage
          applications, and find the right talent.
        </motion.p>

        {/* Search Box */}
        <motion.div
          className="flex w-full md:w-[45%] shadow-md pl-4 rounded-full items-center gap-4 mx-auto bg-white border border-gray-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <input
            type="text"
            placeholder="🔍 Find your dream jobs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-full py-3 px-2 text-lg rounded-l-full bg-transparent placeholder-gray-500 text-gray-800"
          />
          <motion.div whileHover={{ scale: 1.1 }}>
            <Button
              onClick={searchJobHandler}
              className="rounded-r-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-md px-6 py-2 transition-all duration-300"
            >
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
