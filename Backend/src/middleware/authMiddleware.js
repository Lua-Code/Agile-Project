import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(id).select("_id role");
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user no longer exists' });
    }
    req.user = user;
    next()

  } catch (error) {
    error.statusCode = 401
    error.message = 'Request is not authorized'
    next(error)
  }
};