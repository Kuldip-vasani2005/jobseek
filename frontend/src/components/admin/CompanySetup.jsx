import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ArrowLeft } from "lucide-react";
import { COMPANY_API_END_POINT } from "../utils/contants";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetCompanyById from "../../hooks/useGetCompanyById";

const CompanySetup = () => {
  const params = useParams();
  const navigate = useNavigate();

  useGetCompanyById(params.id);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { singleCompany } = useSelector((store) => store.company);

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null,
      });
      setPreview(singleCompany.logoUrl || null);
    }
  }, [singleCompany]);

  const changeEventHandler = (e) => {
    if (e.target.name === "file") {
      const file = e.target.files[0];
      setInput({ ...input, file });
      setPreview(URL.createObjectURL(file));
    } else {
      setInput({ ...input, [e.target.name]: e.target.value });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/adminpanel/companies");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <Navbar />

      {/* Form container with 3D effect */}
      <div className="flex-1 flex items-center justify-center p-6 perspective-[1200px]">
        <form
          onSubmit={submitHandler}
          className="max-w-xl w-full bg-white/90 backdrop-blur-xl rounded-2xl 
                     shadow-[0_20px_40px_rgba(0,0,0,0.25)] border border-gray-200 
                     p-10 space-y-6 transform-gpu transition-transform duration-500 
                     hover:rotate-x-2 hover:rotate-y-2 hover:scale-[1.02]"
        >
          {/* Header */}
          <div className="flex items-center gap-5 mb-6">
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 text-gray-600 font-semibold 
                         transition-all hover:scale-105 hover:shadow-md"
              onClick={() => navigate("/adminpanel/companies")}
            >
              <ArrowLeft />
              <span>Back</span>
            </Button>
            <h1 className="font-extrabold text-2xl text-gray-800 drop-shadow-md">
              Company Setup
            </h1>
          </div>

          {/* Inputs with 3D effect */}
          <div className="grid grid-cols-1 gap-5">
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
                placeholder="Enter company name"
                required
                className="rounded-xl shadow-inner transition-transform hover:translate-y-[-2px] hover:shadow-lg focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                placeholder="Enter company description"
                required
                className="rounded-xl shadow-inner transition-transform hover:translate-y-[-2px] hover:shadow-lg focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
                placeholder="https://example.com"
                className="rounded-xl shadow-inner transition-transform hover:translate-y-[-2px] hover:shadow-lg focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="Enter company location"
                className="rounded-xl shadow-inner transition-transform hover:translate-y-[-2px] hover:shadow-lg focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* File Upload */}
            <div>
              <Label htmlFor="file">Company Logo</Label>
              <Input
                id="file"
                type="file"
                name="file"
                onChange={changeEventHandler}
                accept="image/*"
                className="rounded-xl shadow-inner transition-transform hover:translate-y-[-2px] hover:shadow-lg"
              />

              {preview && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={preview}
                    alt="Company Logo Preview"
                    className="w-32 h-32 object-cover rounded-xl shadow-lg transform-gpu transition-transform duration-700 hover:rotate-y-12 hover:scale-110"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit with 3D button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-lg text-white 
                       bg-gradient-to-r from-gray-700 to-gray-900 
                       shadow-[0_8px_20px_rgba(0,0,0,0.3)] transition-transform 
                       hover:scale-[1.05] hover:translate-y-[-2px] hover:shadow-xl"
          >
            {loading ? "Saving..." : "Save Company"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
