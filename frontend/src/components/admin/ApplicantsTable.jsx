// src/components/applicants/ApplicantsTable.jsx
import React from "react";
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
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { APPLICATION_API_END_POINT } from "../utils/contants";
import { toast } from "sonner";
import axios from "axios";

const shortListingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const applicants = useSelector((store) => store.application.applicants);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <Table className="min-w-[700px]">
        <TableCaption>A list of all applicants for this job</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applicants && applicants.length > 0 ? (
            applicants.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="break-words">
                  {item?.applicant?.fullname || "-"}
                </TableCell>
                <TableCell className="break-words">
                  {item?.applicant?.email || "-"}
                </TableCell>
                <TableCell className="break-words">
                  {item?.applicant?.phoneNumber || "-"}
                </TableCell>
                <TableCell className="break-all">
                  {item?.applicant?.profile?.resume ? (
                    <a
                      className="text-blue-600 underline cursor-pointer"
                      href={item.applicant.profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  ) : (
                    <span>No Resume</span>
                  )}
                </TableCell>
                <TableCell className="break-words">
                  {item?.createdAt?.split("T")[0] || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal className="cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      {shortListingStatus.map((status, index) => (
                        <div
                          key={index}
                          onClick={() => statusHandler(status, item._id)}
                          className="flex w-fit items-center my-2 cursor-pointer"
                        >
                          <span>{status}</span>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No applicants found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
