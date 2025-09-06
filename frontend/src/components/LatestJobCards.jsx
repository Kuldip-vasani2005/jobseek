import React from 'react';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="p-5 rounded-2xl bg-white border border-gray-200 cursor-pointer 
                 shadow-md hover:shadow-2xl 
                 transition-all duration-300 ease-in-out 
                 hover:-translate-y-2 hover:scale-[1.02] 
                 hover:border-transparent hover:bg-gradient-to-r from-purple-50 to-blue-50"
    >
      {/* Company Info */}
      <div>
        <h1 className="font-semibold text-lg text-gray-800">{job?.company?.name}</h1>
        <p className="text-sm text-gray-500">{job?.location || 'India'}</p>
      </div>

      {/* Job Title + Description */}
      <div>
        <h1 className="font-bold text-xl my-2 text-gray-900">{job?.title}</h1>
        <p className="text-sm text-gray-600 line-clamp-3">{job?.description}</p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <Badge className="text-blue-700 font-bold bg-blue-100 hover:bg-blue-200 transition">
          {job?.position} Positions
        </Badge>
        <Badge className="text-[#F83002] font-bold bg-red-100 hover:bg-red-200 transition">
          {job?.jobType}
        </Badge>
        <Badge className="text-[#7209b7] font-bold bg-purple-100 hover:bg-purple-200 transition">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
