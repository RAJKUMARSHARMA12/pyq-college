import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Subject from '../models/Subject.js';
import QuestionPaper, { PYQ_STATUS } from '../models/QuestionPaper.js';
import Solution from '../models/Solution.js';
import Comment from '../models/Comment.js';
import Bookmark from '../models/Bookmark.js';
import { connectDB, isMongoConnected } from './db.js';

dotenv.config();

/**
 * Enhanced Database Seeder with Rich Fake Academic Data
 * Populates realistic courses, subjects, admin/student users, PYQs, solutions, Q&A discussions, and bookmarks.
 */
export const seedDatabase = async () => {
  try {
    await connectDB();

    if (!isMongoConnected()) {
      console.log('ℹ️ Local MongoDB instance not detected.');
      console.log('💡 In-Memory Fallback store is active with pre-populated fake academic papers, subjects, and solution data.');
      return;
    }

    console.log('🧹 Cleaning existing database collections...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Subject.deleteMany({});
    await QuestionPaper.deleteMany({});
    await Solution.deleteMany({});
    await Comment.deleteMany({});
    await Bookmark.deleteMany({});

    console.log('👤 Creating User accounts (Admin & Students)...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@prores.edu',
      password: 'adminPassword123',
      role: 'admin',
    });

    const studentUser = await User.create({
      name: 'Alex Student',
      email: 'student@prores.edu',
      password: 'studentPassword123',
      role: 'student',
    });

    const sarahUser = await User.create({
      name: 'Sarah Miller',
      email: 'sarah.m@prores.edu',
      password: 'studentPassword123',
      role: 'student',
    });

    const davidUser = await User.create({
      name: 'David Chen',
      email: 'david.k@prores.edu',
      password: 'studentPassword123',
      role: 'student',
    });

    const emilyUser = await User.create({
      name: 'Emily Rodriguez',
      email: 'emily.r@prores.edu',
      password: 'studentPassword123',
      role: 'student',
    });

    console.log('🎓 Creating Academic Courses & Departments...');
    const cseCourse = await Course.create({
      name: 'Computer Science & Engineering',
      code: 'CSE',
      degree: 'B.Tech',
      description: 'Department of Computer Science and Systems Engineering',
    });

    const eceCourse = await Course.create({
      name: 'Electronics & Communication Engineering',
      code: 'ECE',
      degree: 'B.Tech',
      description: 'Department of Electronics and Signal Processing',
    });

    const aimlCourse = await Course.create({
      name: 'Artificial Intelligence & Machine Learning',
      code: 'AIML',
      degree: 'B.Tech',
      description: 'School of AI, Robotics & Intelligent Systems',
    });

    const bcaCourse = await Course.create({
      name: 'Bachelor of Computer Applications',
      code: 'BCA',
      degree: 'BCA',
      description: 'Department of Applied Computer Applications',
    });

    console.log('📚 Creating Academic Subjects across Semesters...');
    const dsaSubject = await Subject.create({
      name: 'Data Structures & Algorithms',
      code: 'CS201',
      course: cseCourse._id,
      semester: 3,
    });

    const dbmsSubject = await Subject.create({
      name: 'Database Management Systems',
      code: 'CS301',
      course: cseCourse._id,
      semester: 4,
    });

    const osSubject = await Subject.create({
      name: 'Operating Systems & Kernels',
      code: 'CS302',
      course: cseCourse._id,
      semester: 4,
    });

    const cnSubject = await Subject.create({
      name: 'Computer Networks & Protocols',
      code: 'CS401',
      course: cseCourse._id,
      semester: 5,
    });

    const webSubject = await Subject.create({
      name: 'Web Technologies & MERN Architecture',
      code: 'CS402',
      course: cseCourse._id,
      semester: 5,
    });

    const digitalSubject = await Subject.create({
      name: 'Digital Electronics & Logic Design',
      code: 'EC201',
      course: eceCourse._id,
      semester: 3,
    });

    const mlSubject = await Subject.create({
      name: 'Machine Learning & Neural Networks',
      code: 'AI301',
      course: aimlCourse._id,
      semester: 5,
    });

    const mathSubject = await Subject.create({
      name: 'Calculus & Applied Linear Algebra',
      code: 'MA101',
      course: cseCourse._id,
      semester: 1,
    });

    console.log('📄 Creating Previous Year Question Papers...');
    const papers = await QuestionPaper.create([
      {
        title: 'Data Structures & Algorithms - End Sem Exam 2024',
        subject: dsaSubject._id,
        course: cseCourse._id,
        academicYear: 2024,
        examType: 'End-Sem',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        solutionUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: studentUser._id,
        status: PYQ_STATUS.APPROVED,
        reviewedBy: adminUser._id,
        reviewedAt: new Date(),
        viewsCount: 380,
        downloadsCount: 195,
      },
      {
        title: 'Database Management Systems - Mid Sem Exam 2024',
        subject: dbmsSubject._id,
        course: cseCourse._id,
        academicYear: 2024,
        examType: 'Mid-Sem',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        solutionUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: sarahUser._id,
        status: PYQ_STATUS.APPROVED,
        reviewedBy: adminUser._id,
        reviewedAt: new Date(),
        viewsCount: 290,
        downloadsCount: 142,
      },
      {
        title: 'Computer Networks & Protocols - End Sem Exam 2023',
        subject: cnSubject._id,
        course: cseCourse._id,
        academicYear: 2023,
        examType: 'End-Sem',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: davidUser._id,
        status: PYQ_STATUS.APPROVED,
        reviewedBy: adminUser._id,
        reviewedAt: new Date(),
        viewsCount: 420,
        downloadsCount: 210,
      },
      {
        title: 'Web Technologies & MERN Stack - Model Question Paper 2025',
        subject: webSubject._id,
        course: cseCourse._id,
        academicYear: 2025,
        examType: 'Model Paper',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: studentUser._id,
        status: PYQ_STATUS.APPROVED,
        reviewedBy: adminUser._id,
        reviewedAt: new Date(),
        viewsCount: 510,
        downloadsCount: 340,
      },
      {
        title: 'Digital Electronics & Logic Design - Mid Sem 2024',
        subject: digitalSubject._id,
        course: eceCourse._id,
        academicYear: 2024,
        examType: 'Mid-Sem',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: emilyUser._id,
        status: PYQ_STATUS.APPROVED,
        reviewedBy: adminUser._id,
        reviewedAt: new Date(),
        viewsCount: 190,
        downloadsCount: 88,
      },
      {
        title: 'Machine Learning & Neural Networks - End Sem 2024',
        subject: mlSubject._id,
        course: aimlCourse._id,
        academicYear: 2024,
        examType: 'End-Sem',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: davidUser._id,
        status: PYQ_STATUS.APPROVED,
        reviewedBy: adminUser._id,
        reviewedAt: new Date(),
        viewsCount: 310,
        downloadsCount: 160,
      },
      {
        title: 'Calculus & Applied Mathematics - Quiz I Paper 2023',
        subject: mathSubject._id,
        course: cseCourse._id,
        academicYear: 2023,
        examType: 'Quiz',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: sarahUser._id,
        status: PYQ_STATUS.APPROVED,
        reviewedBy: adminUser._id,
        reviewedAt: new Date(),
        viewsCount: 145,
        downloadsCount: 62,
      },
      // Pending Queue Papers
      {
        title: 'Operating Systems & Kernels - End Sem 2024 (Pending)',
        subject: osSubject._id,
        course: cseCourse._id,
        academicYear: 2024,
        examType: 'End-Sem',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: studentUser._id,
        status: PYQ_STATUS.PENDING,
        viewsCount: 12,
        downloadsCount: 0,
      },
      {
        title: 'Digital Electronics - End Sem 2024 (Pending)',
        subject: digitalSubject._id,
        course: eceCourse._id,
        academicYear: 2024,
        examType: 'End-Sem',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: emilyUser._id,
        status: PYQ_STATUS.PENDING,
        viewsCount: 5,
        downloadsCount: 0,
      },
      // Rejected Paper
      {
        title: 'Data Structures - Unclear Scan 2022',
        subject: dsaSubject._id,
        course: cseCourse._id,
        academicYear: 2022,
        examType: 'Quiz',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: studentUser._id,
        status: PYQ_STATUS.REJECTED,
        rejectionReason: 'Scan resolution is too low and page 2 is cut off at the bottom.',
        reviewedBy: adminUser._id,
        reviewedAt: new Date(),
        viewsCount: 8,
        downloadsCount: 0,
      },
    ]);

    console.log('💡 Creating Verified Solutions & Upvotes...');
    await Solution.create([
      {
        questionPaper: papers[0]._id, // DSA End Sem 2024
        uploadedBy: davidUser._id,
        solutionUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        explanationText: 'Includes detailed step-by-step AVL Tree rotations and Dijkstra shortest path code in C++.',
        status: 'approved',
        upvotesCount: 24,
        upvotedBy: [studentUser._id, sarahUser._id],
        reviewedBy: adminUser._id,
      },
      {
        questionPaper: papers[1]._id, // DBMS Mid Sem 2024
        uploadedBy: sarahUser._id,
        solutionUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        explanationText: 'Complete SQL normalization steps up to 3NF and BCNF with relational algebra queries.',
        status: 'approved',
        upvotesCount: 18,
        upvotedBy: [studentUser._id, davidUser._id],
        reviewedBy: adminUser._id,
      },
      {
        questionPaper: papers[3]._id, // Web Tech Model Paper
        uploadedBy: studentUser._id,
        solutionUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        explanationText: 'Full Express REST API router setup, JWT cookie authentication flow, and React state management code.',
        status: 'pending',
        upvotesCount: 5,
        upvotedBy: [emilyUser._id],
      },
    ]);

    console.log('💬 Creating Q&A Discussions & Comments...');
    await Comment.create([
      {
        questionPaper: papers[0]._id,
        user: sarahUser._id,
        content: 'For Question 3b on Graph BFS traversal, remember to track the visited boolean array to avoid infinite loops!',
      },
      {
        questionPaper: papers[0]._id,
        user: studentUser._id,
        content: 'Thanks Sarah! Is the B-Tree insertion step covered in Unit 4 or Unit 5 for the upcoming exam?',
      },
      {
        questionPaper: papers[1]._id,
        user: davidUser._id,
        content: 'Question 2 SQL query can also be solved using LEFT OUTER JOIN instead of subqueries for better performance.',
      },
    ]);

    console.log('🔖 Creating Bookmarks...');
    await Bookmark.create([
      {
        user: studentUser._id,
        questionPaper: papers[0]._id,
      },
      {
        user: studentUser._id,
        questionPaper: papers[3]._id,
      },
    ]);

    console.log('✅ Fake Academic Data Seeded Successfully!');
    console.log('--------------------------------------------------');
    console.log('🔑 Demo Admin:   admin@prores.edu   / adminPassword123');
    console.log('🔑 Demo Student: student@prores.edu / studentPassword123');
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('❌ Error Seeding Database:', error);
  }
};

// Execute if run directly
if (process.argv[2] === '--run') {
  seedDatabase().then(() => process.exit(0));
}
