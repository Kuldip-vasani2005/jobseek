import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2, Bookmark } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { USER_API_END_POINT } from "../utils/contants";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "../../redux/authSlice";
import { motion } from "framer-motion";
import { Switch } from "../../components/ui/switch";

// ✅ Toggle switch
const ToggleSwitch = ({ isOn, handleToggle }) => (
  <div
    onClick={handleToggle}
    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
      isOn ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
        isOn ? "translate-x-6" : "translate-x-0"
      }`}
    ></div>
  </div>
);

const Navbar = () => {
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // ✅ Apply dark mode globally (body class)
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <motion.nav
      className={`shadow-lg sticky top-0 z-50 transition-colors ${
        darkMode
          ? "bg-gradient-to-r from-gray-800 via-gray-900 to-black"
          : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80 }}
    >
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        {/* ✅ Logo */}
        <motion.h1
          className="text-2xl text-white font-extrabold cursor-pointer select-none"
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/home">
            Job<span className="text-yellow-300">Seek</span>
          </Link>
        </motion.h1>

        {/* ✅ Nav Links */}
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex font-medium items-center gap-6">
            {user ? (
              user.role === "recruiter" ? (
                <>
                  <motion.li
                    whileHover={{ scale: 1.1, rotateX: 10, rotateY: -10 }}
                    className="cursor-pointer text-white hover:text-yellow-300 transition-colors"
                  >
                    <Link to="/adminpanel/companies">Companies</Link>
                  </motion.li>
                  <motion.li
                    whileHover={{ scale: 1.1, rotateX: 10, rotateY: -10 }}
                    className="cursor-pointer text-white hover:text-yellow-300 transition-colors"
                  >
                    <Link to="/adminpanel/jobs">Jobs</Link>
                  </motion.li>
                </>
              ) : (
                <>
                  <motion.li
                    whileHover={{ scale: 1.1, rotateX: 10, rotateY: -10 }}
                    className="cursor-pointer text-white hover:text-yellow-300 transition-colors"
                  >
                    <Link to="/">Home</Link>
                  </motion.li>
                  <motion.li
                    whileHover={{ scale: 1.1, rotateX: 10, rotateY: -10 }}
                    className="cursor-pointer text-white hover:text-yellow-300 transition-colors"
                  >
                    <Link to="/jobs">Jobs</Link>
                  </motion.li>
                  <motion.li
                    whileHover={{ scale: 1.1, rotateX: 10, rotateY: -10 }}
                    className="cursor-pointer text-white hover:text-yellow-300 transition-colors"
                  >
                    <Link to="/browse">Browse</Link>
                  </motion.li>
                  <motion.li
                    whileHover={{ scale: 1.1, rotateX: 10, rotateY: -10 }}
                    className="cursor-pointer text-white hover:text-yellow-300 transition-colors flex items-center gap-1"
                  >
                    <Bookmark size={16} />
                    <Link to="/saved">Saved Jobs</Link>
                  </motion.li>
                </>
              )
            ) : (
              <>
                <motion.li
                  whileHover={{ scale: 1.1, rotateX: 10, rotateY: -10 }}
                  className="cursor-pointer text-white hover:text-yellow-300 transition-colors"
                >
                  <Link to="/">Home</Link>
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.1, rotateX: 10, rotateY: -10 }}
                  className="cursor-pointer text-white hover:text-yellow-300 transition-colors"
                >
                  <Link to="/jobs">Jobs</Link>
                </motion.li>
              </>
            )}
          </ul>

          {/* ✅ Dark Mode Switch */}
          <ToggleSwitch
            isOn={darkMode}
            handleToggle={() => setDarkMode(!darkMode)}
          />

          {/* ✅ Auth Buttons / Avatar */}
          {!user ? (
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.1, rotateX: 10, rotateY: -5, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-br from-gray-700 via-gray-900 to-black shadow-lg shadow-black/50 transition-all"
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.1, rotateX: 10, rotateY: -5, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-xl font-bold text-white bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-2xl shadow-purple-500/50 transition-all"
                >
                  Signup
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <motion.button
                  className="cursor-pointer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar>
                    <AvatarImage
                      src={
                        user.profile?.profilePhoto ||
                        "https://static.vecteezy.com/system/resources/previews/032/176/191/non_2x/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg"
                      }
                      alt={user?.fullname || "User"}
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </motion.button>
              </PopoverTrigger>
              <PopoverContent
                sideOffset={8}
                className="w-80 space-y-4 rounded-2xl shadow-lg bg-white"
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateX: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex gap-4 items-center">
                    <Avatar>
                      <AvatarImage
                        src={
                          user.profile?.profilePhoto ||
                          "https://img.freepik.com/free-vector/colorful-letter-gradient-logo-design_474888-2309.jpg"
                        }
                        alt="profile"
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{user?.fullname}</h4>

                      {/* ✅ Show bio only for recruiters */}
                      {user?.role === "jobseeker" && (
                        <p className="text-sm text-muted-foreground">
                          {user?.profile?.bio || "No bio available"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col text-gray-600 gap-2 mt-3">
                    {user && user.role === "jobseeker" && (
                      <>
                        <Button
                          variant="link"
                          className="flex items-center gap-2 p-0 h-auto"
                        >
                          <User2 className="w-4 h-4" />
                          <Link to="/profile">View Profile</Link>
                        </Button>
                        <Button
                          variant="link"
                          className="flex items-center gap-2 p-0 h-auto"
                        >
                          <Bookmark className="w-4 h-4" />
                          <Link to="/saved">Saved Jobs</Link>
                        </Button>
                      </>
                    )}
                    <Button
                      variant="link"
                      className="flex items-center gap-2 p-0 h-auto text-red-600"
                      onClick={logoutHandler}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </motion.div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
