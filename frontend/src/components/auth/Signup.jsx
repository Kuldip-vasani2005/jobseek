import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/contants";
import { setLoading } from "../../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const changeFileHandler = (e) => {
    setInput({
      ...input,
      file: e.target.files?.[0],
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      {/* Centered Signup Form */}
      <div className="flex flex-1 items-center justify-center relative z-10">
        <motion.form
          onSubmit={submitHandler}
          initial={{ scale: 0.9, opacity: 0, rotateX: -10 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{
            scale: 1.02,
            rotateX: 2,
            rotateY: 2,
            boxShadow: "0px 20px 40px rgba(0,0,0,0.25)",
          }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 p-6 transform-gpu"
        >
          <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-6 drop-shadow-md">
            Create an Account ✨
          </h1>

          {/* Full Name */}
          <div className="my-3">
            <Label className="block text-gray-700 font-semibold mb-1">
              Full Name
            </Label>
            <motion.div
              whileHover={{
                scale: 1.03,
                rotateX: 2,
                rotateY: 2,
                boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                placeholder="Enter your full name"
                className="border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 
                           p-2 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 shadow-md"
              />
            </motion.div>
          </div>

          {/* Email */}
          <div className="my-3">
            <Label className="block text-gray-700 font-semibold mb-1">
              Email
            </Label>
            <motion.div
              whileHover={{
                scale: 1.03,
                rotateX: 2,
                rotateY: 2,
                boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="Enter your email"
                className="border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 
                           p-2 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 shadow-md"
              />
            </motion.div>
          </div>

          {/* Phone Number */}
          <div className="my-3">
            <Label className="block text-gray-700 font-semibold mb-1">
              Phone Number
            </Label>
            <motion.div
              whileHover={{
                scale: 1.03,
                rotateX: 2,
                rotateY: 2,
                boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Input
                type="tel"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                placeholder="Enter your phone number"
                className="border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 
                           p-2 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 shadow-md"
              />
            </motion.div>
          </div>

          {/* Password */}
          <div className="my-3">
            <Label className="block text-gray-700 font-semibold mb-1">
              Password
            </Label>
            <motion.div
              whileHover={{
                scale: 1.03,
                rotateX: 2,
                rotateY: 2,
                boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Enter your password"
                className="border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 
                           p-2 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 shadow-md"
              />
            </motion.div>
          </div>

          {/* Role & Profile Upload */}
          <div className="flex flex-col md:flex-row items-center justify-between my-5 gap-4">
            <RadioGroup className="flex items-center gap-6 text-gray-700">
              <motion.label
                whileHover={{ scale: 1.1, rotateX: 5, rotateY: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg shadow-md bg-white"
              >
                <input
                  type="radio"
                  name="role"
                  checked={input.role === "jobseeker"}
                  onChange={changeEventHandler}
                  value="jobseeker"
                  className="accent-indigo-500 scale-125"
                />
                <span className="font-medium">JobSeeker</span>
              </motion.label>

              <motion.label
                whileHover={{ scale: 1.1, rotateX: -5, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg shadow-md bg-white"
              >
                <input
                  type="radio"
                  name="role"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  value="recruiter"
                  className="accent-indigo-500 scale-125"
                />
                <span className="font-medium">Recruiter</span>
              </motion.label>
            </RadioGroup>

            <div className="flex items-center gap-2 text-gray-700">
              <Label htmlFor="profile-upload" className="cursor-pointer">
                Profile
              </Label>
              <motion.div
                whileHover={{
                  scale: 1.03,
                  rotateX: 2,
                  rotateY: 2,
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Input
                  id="profile-upload"
                  accept="image/*"
                  type="file"
                  name="file"
                  onChange={changeFileHandler}
                  className="cursor-pointer text-gray-700 border border-gray-300 p-2 w-full 
                             rounded-lg shadow-md bg-gray-50"
                />
              </motion.div>
            </div>
          </div>

          {/* Submit Button */}
          {loading ? (
            <Button className="w-full my-4 bg-indigo-500 text-white font-bold py-2 rounded-lg shadow-lg flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full my-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg shadow-lg transition-all"
            >
              Sign Up
            </Button>
          )}

          {/* Login Link */}
          <p className="text-center text-gray-700 mt-3">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Login
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Signup;
