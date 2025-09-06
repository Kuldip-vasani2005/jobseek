import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Loader2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "./utils/contants";
import { setUser } from "../redux/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills || [],
    file: null,
  });

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trimStart();
    if (name === "skills") {
      setInput({ ...input, skills: trimmedValue.split(",").map((s) => s.trim()) });
    } else {
      setInput({ ...input, [name]: trimmedValue });
    }
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("bio", input.bio);
      formData.append("skills", input.skills.join(","));
      if (input.file) formData.append("file", input.file);

      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
        navigate("/profile");
      } else {
        toast.error(res.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/profile");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateX: -10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-tr from-indigo-500 via-teal-400 to-emerald-300 rounded-2xl shadow-2xl overflow-hidden"
        >
          <DialogHeader className="flex justify-between items-center p-4 bg-white rounded-t-2xl">
            <DialogTitle className="text-xl font-bold text-gray-800">Update Profile</DialogTitle>
            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.2, rotate: 90 }}
              className="text-gray-600 hover:text-red-600"
            >
              <X />
            </motion.button>
          </DialogHeader>

          <form onSubmit={submitHandler} className="bg-white p-6 space-y-4">
            {["fullname", "email", "phoneNumber", "bio", "skills", "file"].map((field) => {
              const isTextarea = field === "bio";
              const label = field.charAt(0).toUpperCase() + field.slice(1);
              return (
                <motion.div
                  key={field}
                  whileHover={{ scale: 1.02, rotateX: 2 }}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Label htmlFor={field} className="text-gray-700 font-semibold">{label}</Label>
                  {isTextarea ? (
                    <Textarea
                      id={field}
                      name={field}
                      onChange={changeEventHandler}
                      value={input[field]}
                      className="col-span-3"
                    />
                  ) : field === "file" ? (
                    <Input
                      id={field}
                      name={field}
                      type="file"
                      onChange={fileChangeHandler}
                      accept=".pdf,.doc,.docx,.png"
                      className="col-span-3"
                    />
                  ) : (
                    <Input
                      id={field}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      onChange={changeEventHandler}
                      value={field === "skills" ? input.skills.join(", ") : input[field]}
                      className="col-span-3"
                    />
                  )}
                </motion.div>
              );
            })}

            <DialogFooter>
              {loading ? (
                <Button className="w-full my-2" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <motion.div whileHover={{ scale: 1.05, rotateX: 2 }}>
                  <Button
                    type="submit"
                    className="w-full my-2 bg-gradient-to-r from-indigo-600 via-teal-500 to-emerald-400 text-white font-bold shadow-lg hover:shadow-xl"
                  >
                    Submit
                  </Button>
                </motion.div>
              )}
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
