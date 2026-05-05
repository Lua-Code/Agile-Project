import Course from "../models/Course.js";

export const getAllCourses = async () => {
  return await Course.find({ status: "active" }).populate('professorId', 'firstName lastName');
};
