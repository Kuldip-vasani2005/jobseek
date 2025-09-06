import React from "react";
import { useSelector } from "react-redux";
import LatestJobCards from "./LatestJobCards";
import { motion } from "framer-motion";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 12 },
    },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto my-20 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated Heading */}
      <motion.h1
        className="text-4xl font-bold text-center"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-transparent bg-clip-text">
          Latest & Top
        </span>{" "}
        Job Openings
      </motion.h1>

      {/* Job Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10"
        variants={containerVariants}
      >
        {allJobs.length <= 0 ? (
          <motion.span
            className="text-gray-500 text-center col-span-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No Job Available
          </motion.span>
        ) : (
          allJobs?.slice(0, 6).map((job) => (
            <motion.div
              key={job._id}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                rotateX: 6,
                rotateY: -6,
                boxShadow: "0px 12px 30px rgba(0,0,0,0.25)",
              }}
              whileTap={{ scale: 0.97 }}
              className="transition-transform rounded-2xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            >
              {/* Inner Card with White Background */}
              <div className="bg-white rounded-2xl h-full p-4">
                <LatestJobCards job={job} />
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default LatestJobs;
