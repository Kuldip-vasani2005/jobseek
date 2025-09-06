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
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Edit2, Trash2, MoreHorizontal } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "../utils/contants";
import { toast } from "sonner";

const CompaniesTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const [filterCompany, setFilterCompany] = useState([]);

  useEffect(() => {
    const searchTerm = searchCompanyByText?.toLowerCase().trim();

    const filteredCompany =
      Array.isArray(companies) && companies.length > 0
        ? companies.filter((company) => {
            if (!searchTerm) return true;
            return company?.name?.toLowerCase().includes(searchTerm);
          })
        : [];

    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

  // 🔹 Delete handler
  const handleDelete = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    try {
      const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Company deleted successfully!");
        // Update the filtered list locally
        setFilterCompany((prev) => prev.filter((c) => c._id !== companyId));
        // Optionally, dispatch an action to update Redux store
        // dispatch(fetchCompanies());
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error(error.response?.data?.message || "Failed to delete company");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl shadow-2xl bg-white transform transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
      <Table>
        <TableCaption className="text-gray-600 italic">
          A list of your recent registered companies
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-purple-200 via-pink-100 to-blue-100 shadow-md">
            <TableHead className="font-bold text-gray-700">Logo</TableHead>
            <TableHead className="font-bold text-gray-700">Name</TableHead>
            <TableHead className="font-bold text-gray-700">Date</TableHead>
            <TableHead className="text-right font-bold text-gray-700">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCompany.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-6 italic">
                No companies found
              </TableCell>
            </TableRow>
          ) : (
            filterCompany.map((company) => (
              <TableRow
                key={company._id}
                className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 
                           transform hover:scale-[1.02] transition-all duration-300 
                           shadow-sm hover:shadow-lg cursor-pointer"
              >
                <TableCell>
                  <Avatar className="w-12 h-12 ring-2 ring-purple-300 shadow-lg transform hover:scale-105 transition-all duration-300">
                    <AvatarImage
                      src={company.logo || "https://placehold.co/150x150"}
                      alt={company.name}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold">
                      {company?.name?.[0]?.toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-semibold text-gray-700">{company?.name}</TableCell>
                <TableCell className="text-gray-500">
                  {company?.createdAt ? new Date(company.createdAt).toLocaleDateString() : "--"}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal className="w-5 h-5 text-gray-600 hover:text-purple-600 hover:scale-110 transition-all duration-200" />
                    </PopoverTrigger>
                    <PopoverContent className="w-36 shadow-2xl rounded-xl p-3 bg-white border border-gray-200">
                      <div
                        onClick={() => navigate(`/adminpanel/companies/${company._id}`)}
                        className="flex items-center gap-2 w-fit cursor-pointer text-gray-700 
                                   hover:text-purple-600 hover:scale-105 transition-transform duration-200 mb-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </div>

                      {/* 🔹 Delete button */}
                      <div
                        onClick={() => handleDelete(company._id)}
                        className="flex items-center gap-2 w-fit cursor-pointer text-red-600 
                                   hover:text-red-800 hover:scale-105 transition-transform duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
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
  );
};

export default CompaniesTable;
