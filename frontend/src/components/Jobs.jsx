import { useSelector } from "react-redux";
import { useState } from "react";
import FilterCard from "./FilterCard";
import Job from "./job";
import Navbar from "./shared/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const Jobs = () => {
  const { allJobs = [], loading, error } = useSelector((store) => store.job);
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  // ✅ Filter jobs with salary in LPA
  const filteredJobs = allJobs.filter((job) => {
    let match = true;

    // Location
    if (selectedFilters.Location) {
      match = match && job.location === selectedFilters.Location;
    }

    // Industry
    if (selectedFilters.Industry) {
      match = match && job.title === selectedFilters.Industry;
    }

    // Salary (convert Rs → LPA and compare with selected range)
    if (selectedFilters.Salary) {
      const [minStr, maxStr] = selectedFilters.Salary.split("-");
      const min = Number(minStr);
      const max = maxStr === "+" ? Infinity : Number(maxStr);

      const jobSalaryLPA = job.salary / 100000;

      if (!(jobSalaryLPA >= min && jobSalaryLPA <= max)) {
        match = false;
      }
    }

    return match;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] via-[#c0d6df] to-[#a0e1e0]">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Left filter panel */}
          <div className="w-full md:w-1/4">
            <FilterCard
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Job listings */}
          <div className="flex-1">
            {loading ? (
              <div className="p-5 text-center text-gray-500">Loading jobs...</div>
            ) : error ? (
              <div className="p-5 text-center text-red-500">
                {error || "Something went wrong while fetching jobs."}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-5 text-center text-gray-500">No jobs found</div>
            ) : (
              <div className="grid gap-5 p-5 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {filteredJobs.map((job) => (
                    <motion.div
                      key={job?._id}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2 }}
                      className="transition-all duration-300"
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
