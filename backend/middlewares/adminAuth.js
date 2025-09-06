import jwt from "jsonwebtoken";

const adminAuth = (roles = ["admin"]) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "No token" });
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  };
};

export default adminAuth;
