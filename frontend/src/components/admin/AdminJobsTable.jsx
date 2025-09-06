import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal, Building2, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { JOB_API_END_POINT } from "../utils/contants";

const AdminJobsTable = () => {
  const { allAdminJobs = [], searchJobByText = "" } = useSelector(
    (store) => store.job
  );
  const [filterJobs, setFilterJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;

      const titleMatch = job?.title
        ?.toLowerCase()
        .includes(searchJobByText.toLowerCase());
      const companyMatch = job?.company?.name
        ?.toLowerCase()
        .includes(searchJobByText.toLowerCase());

      return titleMatch || companyMatch;
    });

    setFilterJobs(filtered);
  }, [allAdminJobs, searchJobByText]);

  // ✅ handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Job deleted successfully");
        setFilterJobs((prev) => prev.filter((job) => job._id !== id));
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  return (
    <div className="p-6">
      <div className="rounded-2xl shadow-2xl bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 transform transition-transform hover:scale-[1.01] duration-300">
        <Table className="rounded-xl overflow-hidden">
          <TableCaption className="text-gray-600 font-medium">
            A list of your recent posted jobs
          </TableCaption>
          <TableHeader className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 text-white">
            <TableRow>
              <TableHead className="text-white">Job Title</TableHead>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-right text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterJobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-400 py-6"
                >
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              filterJobs.map((job) => (
                <TableRow
                  key={job._id}
                  className="hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 transition-all duration-300"
                >
                  <TableCell className="font-semibold text-gray-800">
                    {job?.title || "--"}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {job?.company?.name || "--"}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {job?.createdAt
                      ? new Date(job.createdAt).toLocaleDateString()
                      : "--"}
                  </TableCell>
                  <TableCell className="text-right cursor-pointer">
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal className="w-5 h-5 text-gray-600 hover:text-purple-600 transition-colors" />
                      </PopoverTrigger>
                      <PopoverContent className="w-44 p-3 space-y-2 bg-white/90 backdrop-blur-xl shadow-xl rounded-xl">
                        {/* Edit Job */}
                        <div
                          onClick={() =>
                            navigate(`/adminpanel/jobs/edit/${job._id}`)
                          }
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-100 hover:scale-[1.02] transition-transform cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4 text-purple-500" />
                          <span>Edit Job</span>
                        </div>

                        {/* View Applicants */}
                        <div
                          onClick={() =>
                            navigate(`/adminpanel/jobs/${job._id}/applicants`)
                          }
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-green-100 hover:scale-[1.02] transition-transform cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-green-500" />
                          <span>Applicants</span>
                        </div>

                        {/* View Company */}
                        <div
                          onClick={() =>
                            navigate(`/adminpanel/companies/${job.company?._id}`)
                          }
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-100 hover:scale-[1.02] transition-transform cursor-pointer"
                        >
                          <Building2 className="w-4 h-4 text-blue-500" />
                          <span>Company</span>
                        </div>

                        {/* Delete Job */}
                        <div
                          onClick={() => handleDelete(job._id)}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-red-100 hover:scale-[1.02] transition-transform cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                          <span className="text-red-600">Delete</span>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminJobsTable;
