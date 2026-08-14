import { asyncHandler } from '../middleware/errorMiddleware.js';
import courseRepo from '../repositories/CourseRepository.js';
import subjectRepo from '../repositories/SubjectRepository.js';

/**
 * Course and Subject Catalog Controllers
 * Pure Mongoose Database Queries.
 */

// @desc    Get All Courses / Departments
// @route   GET /api/v1/catalog/courses
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await courseRepo.find({}, '', { name: 1 });
  res.status(200).json({ success: true, count: courses.length, data: courses });
});

// @desc    Get Subjects by Course ID and optional Semester
// @route   GET /api/v1/catalog/subjects
export const getSubjects = asyncHandler(async (req, res) => {
  const { courseId, semester } = req.query;
  const subjects = await subjectRepo.findByCourseAndSemester(courseId, semester);
  res.status(200).json({ success: true, count: subjects.length, data: subjects });
});

// @desc    Create a Course (Admin Only)
// @route   POST /api/v1/catalog/courses
export const createCourse = asyncHandler(async (req, res) => {
  const course = await courseRepo.create(req.body);
  res.status(201).json({ success: true, data: course });
});

// @desc    Create a Subject (Admin Only)
// @route   POST /api/v1/catalog/subjects
export const createSubject = asyncHandler(async (req, res) => {
  const subject = await subjectRepo.create(req.body);
  res.status(201).json({ success: true, data: subject });
});
