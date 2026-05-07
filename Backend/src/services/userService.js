import User from "../models/User.js";

export const getProfileService = async (userId) => {
  const user = await User.findById(userId).select("-passwordHash");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};