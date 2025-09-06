import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authenticated", success: false });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Not authenticated", success: false });

    req.user = user;
    req.id = user._id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authenticated", success: false });
  }
};

export default isAuthenticated;
