import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUser } from "@/redux/authSlice"; // ✅ make sure you have this action

/**
 * ProtectedRoute Component
 * @param {React.ReactNode} children - Component to render if authorized
 * @param {Array} roles - Optional roles allowed to access this route
 */
const ProtectedRoute = ({ children, roles = ["recruiter"] }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user) {
          const res = await axios.get(
            "http://localhost:8000/api/v1/adminpanel/checkauth",
            { withCredentials: true }
          );
          if (res.data.success) {
            dispatch(setUser(res.data.user)); // ✅ save user in redux
          } else {
            navigate("/adminpanellogin");
          }
        } else if (!roles.includes(user.role)) {
          navigate("/"); // not enough role
        }
      } catch (err) {
        navigate("/adminpanellogin");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [user, roles, dispatch, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
