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
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      {/* Centered Form */}
      <div className="flex flex-1 items-center justify-center relative z-10">
        <motion.form
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
        >
          <h1 className="text-center text-2xl font-extrabold text-gray-800 mb-6">
            Welcome Back 👋
          </h1>

          {/* Email */}
          <div className="my-3">
            <Label className="block text-gray-700 font-semibold mb-1">
              Email
            </Label>
            <motion.div
              whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
              whileFocus={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="Enter your email"
                className="border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 p-2 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
              />
            </motion.div>
          </div>

          {/* Password */}
          <div className="my-3">
            <Label className="block text-gray-700 font-semibold mb-1">
              Password
            </Label>
            <motion.div
              whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
              whileFocus={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Enter your password"
                className="border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 p-2 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
              />
            </motion.div>
          </div>

          {/* Role Selection */}
          {/* Role Selection */}
          <div className="flex items-center justify-between my-5">
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
              Login
            </Button>
          )}

          {/* Signup Link */}
          <p className="text-center text-gray-700 mt-3">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Signup
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;
