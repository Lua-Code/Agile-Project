import User from "../models/User.js";
import Student from "../models/Student.js";
import bcrypt from "bcrypt";

// CREATE STUDENT (also creates User with role "student")
export const createStudent = async (data) => {
  const { fullName, email, password, department, program, yearLevel, status } = data;

  if (!fullName || !email || !password || !department || !program || !yearLevel) {
    const err = new Error("Missing required fields");
    err.statusCode = 400;
    throw err;
  }

  if (password.length < 6) {
    const err = new Error("Password must be at least 6 characters");
    err.statusCode = 400;
    throw err;
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
    role: "student",
  });

  const lastStudent = await Student.findOne().sort({ studentId: -1 }).lean();
  const studentId = lastStudent ? lastStudent.studentId + 1 : 1;

  const student = await Student.create({
    userId: user._id,
    studentId,
    department,
    program,
    yearLevel: Number(yearLevel),
    status: status || "active",
  });

  return { user, student };
};

// GET ALL STUDENTS
export const getStudents = async (search = "") => {
  let students = await Student.find()
    .populate("userId", "fullName email")
    .lean();

  if (search) {
    const regex = new RegExp(search, "i");
    students = students.filter(
      (s) =>
        regex.test(s.userId?.fullName) ||
        regex.test(s.userId?.email) ||
        regex.test(String(s.studentId))
    );
  }

  return students.map((s) => ({
    _id: s._id,
    studentId: s.studentId,
    name: s.userId?.fullName,
    email: s.userId?.email,
    department: s.department,
    program: s.program,
    yearLevel: s.yearLevel,
    status: s.status,
  }));
};
