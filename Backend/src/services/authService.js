import User from "../models/User.js";
import bcrypt from "bcrypt";

export const register = async (fullName, email, password, role) => {
  if (!fullName || !email || !password || !role) {
    throw new Error("Missing fields");
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    const err = new Error("Email already exists");
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    passwordHash,
    role,
  });

  return user;
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  return user;
};