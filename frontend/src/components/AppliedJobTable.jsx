import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  return (
    <div className="overflow-x-auto rounded-2xl shadow-xl border border-gray-200 bg-white p-4">
      <Table className="min-w-full">
        <TableCaption className="text-gray-500 text-sm">
          A list of your applied jobs
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="px-6 py-3 text-left font-medium text-gray-700">
              Date
            </TableHead>
            <TableHead className="px-6 py-3 text-left font-medium text-gray-700">
              Job Role
            </TableHead>
            <TableHead className="px-6 py-3 text-left font-medium text-gray-700">
              Company
            </TableHead>
            <TableHead className="px-6 py-3 text-right font-medium text-gray-700">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!allAppliedJobs || allAppliedJobs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center px-6 py-4 text-gray-500"
              >
                You haven't applied to any job yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <motion.tr
                key={appliedJob.id || appliedJob._id}
                className="hover:bg-gray-50 transition-all cursor-pointer"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <TableCell className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {new Date(appliedJob?.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {appliedJob.job?.title}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {appliedJob.job?.company?.name}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Badge
                    className={`font-semibold px-3 py-1 rounded-full ${
                      appliedJob?.status === "Rejected"
                        ? "bg-red-500 text-white"
                        : appliedJob?.status === "Pending"
                        ? "bg-yellow-400 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {appliedJob.status}
                  </Badge>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
