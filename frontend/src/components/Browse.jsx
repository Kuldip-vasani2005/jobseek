import React from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Browse = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffbf0] via-[#ffe4c4] to-[#ffd1dc]">
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4">
        <h1 className="font-bold text-2xl my-10 text-gray-800">
          Search Results ({allJobs?.length || 0})
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allJobs && allJobs.length > 0 ? (
            allJobs.map((job) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  rotateX: 6,
                  rotateY: -6,
                  backgroundColor: '#fff1f8', // Soft pink hover effect
                  boxShadow: '0px 15px 35px rgba(255, 105, 180, 0.35)',
                  transition: { type: 'spring', stiffness: 200 },
                }}
                className="bg-white rounded-xl border border-gray-100 shadow-md transition-transform transition-colors"
              >
                <Job job={job} />
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No jobs found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
