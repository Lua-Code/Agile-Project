import Course from "../models/Course.js";
import Professor from "../models/Professor.js";
import User from "../models/User.js";

// GET ALL COURSES
export const getAllCourses = async () => {
  return await Course.find()
    .populate({
      path: "professorId",
      populate: {
        path: "userId",
        select: "fullName email",
      },
    })
    .populate("prerequisites", "courseCode title");
};

// CREATE COURSE
export const createCourse = async (data) => {
  const {
    courseCode,
    title,
    type,
    creditHours,
    department,
    professorId,
    description,
    prerequisites,
  } = data;

  if (!courseCode || !title || !type || creditHours === undefined || creditHours === null || creditHours === "" || !department) {
    const err = new Error("Missing required fields");
    err.statusCode = 400;
    throw err;
  }

  const exists = await Course.findOne({ courseCode });

  if (exists) {
    const err = new Error("Course already exists");
    err.statusCode = 409;
    throw err;
  }

  return await Course.create({
    courseCode,
    title,
    type,
    creditHours,
    department,
    professorId,
    description,
    prerequisites,
  });
};

// UPDATE COURSE
export const updateCourse = async (id, data) => {
  const course = await Course.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!course) {
    const err = new Error("Course not found");
    err.statusCode = 404;
    throw err;
  }

  return course;
};

// DELETE COURSE
export const deleteCourse = async (id) => {
  const course = await Course.findByIdAndDelete(id);

  if (!course) {
    const err = new Error("Course not found");
    err.statusCode = 404;
    throw err;
  }

  return course;
};