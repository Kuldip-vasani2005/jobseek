import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { COMPANY_API_END_POINT } from "../utils/contants";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "../../redux/companySlice";
import { useState } from "react";
import axios from "axios";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (!companyName.trim()) {
      newErrors.companyName = "Company name is required";
    } else if (companyName.trim().length < 2) {
      newErrors.companyName = "Company name must be at least 2 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerNewCompany = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { name: companyName.trim() },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res?.data.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        navigate(`/adminpanel/companies/${res.data.company._id}`);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);

      if (
        error.response?.data?.message?.toLowerCase().includes("already exists")
      ) {
        setErrors({ companyName: "A company with this name already exists" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Gradient Heading with 3D shadow */}
        <div className="my-10 text-center">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-lg">
            Create Your Company
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Give your company a unique name. You can change it later.
          </p>
        </div>

        {/* Input field with glowing effect */}
        <div className="mb-6">
          <label
            htmlFor="companyName"
            className="block text-sm font-semibold mb-2 text-gray-700"
          >
            Company Name *
          </label>
          <Input
            id="companyName"
            type="text"
            placeholder="JobHunt, Microsoft etc."
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              if (errors.companyName)
                setErrors({ ...errors, companyName: "" });
            }}
            className={`transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-md rounded-xl
            ${errors.companyName ? "border-red-500 ring-red-500" : ""}`}
            disabled={loading}
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
          )}
        </div>

        {/* Buttons with 3D hover effect */}
        <div className="flex items-center gap-4 mt-10">
          <Button
            variant="outline"
            onClick={() => navigate("/adminpanel/companies")}
            disabled={loading}
            className="px-6 py-2 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={registerNewCompany}
            disabled={loading || !companyName.trim()}
            className="px-6 py-2 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 
            bg-gradient-to-r from-indigo-500 to-purple-600 text-white transition-all"
          >
            {loading ? "Creating..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
