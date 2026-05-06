import * as studentService from "../services/studentService.js";

export const createStudent = async (req, res, next) => {
  try {
    const result = await studentService.createStudent(req.body);
    res.status(201).json({
      message: "Student created successfully",
      student: result.student,
      user: {
        id: result.user._id,
        fullName: result.user.fullName,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getStudents = async (req, res, next) => {
  try {
    const students = await studentService.getStudents(req.query.search || "");
    res.json(students);
  } catch (err) {
    next(err);
  }
};
