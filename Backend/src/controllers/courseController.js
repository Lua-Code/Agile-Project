import * as courseService from "../services/courseService.js";

export const checkCourseCode = async (req, res, next) => {
    try {
        const { code } = req.query;
        if (!code) return res.status(400).json({ message: "code query param required" });
        const unique = await courseService.isCourseCodeUnique(code.toUpperCase());
        res.json({ unique });
    } catch (err) {
        next(err);
    }
};

export const getCourses = async (req, res, next) => {
    try {
        const courses = await courseService.getAllCourses();
        res.json(courses);
    } catch (err) {
        next(err);
    }
};

export const createCourse = async (req, res, next) => {
    try {
        const course = await courseService.createCourse(req.body);
        res.status(201).json(course);
    } catch (err) {
        next(err);
    }
};

export const updateCourse = async (req, res, next) => {
    try {
        const course = await courseService.updateCourse(
            req.params.id,
            req.body
        );
        res.json(course);
    } catch (err) {
        next(err);
    }
};

export const deleteCourse = async (req, res, next) => {
    try {
        await courseService.deleteCourse(req.params.id);
        res.json({ message: "Course deleted" });
    } catch (err) {
        next(err);
    }
};

export const getMyCourses = async (req, res) => {
  try {
    const courses = await courseService.getMyCoursesService(
      req.session.user
    );

    res.status(200).json({ courses });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to fetch courses",
    });
  }
};