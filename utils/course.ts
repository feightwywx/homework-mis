import { createMisConnection } from "./mysql";
import { Course } from "./types";

type CourseRow = {
  id: number;
  name: string;
  time: string;
  ended: number;
  teacherID: number;
  teacherName: string;
};

type StudentIDRow = {
  studentID: number;
}

export async function getStudentCourses(id: number) {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    `
    SELECT course.* , teacher.name AS teacherName
    FROM course
    JOIN course_student ON course.id = course_student.courseID 
    JOIN teacher ON course.teacherID = teacher.id
    WHERE course_student.studentID = ?;`,
    [id]
  );
  await conn.end();

  const courses = (rows as Array<CourseRow>).map((row) => {
    return {
      ...row,
      ended: row.ended === 0 ? false : true,
    } as Course;
  });

  return courses;
}

export async function getTeacherCourses(id: number) {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    `
    SELECT course.* , teacher.name AS teacherName
    FROM course
    JOIN teacher ON course.teacherID = teacher.id
    WHERE teacher.id = ?;`,
    [id]
  );
  await conn.end();

  const courses = (rows as Array<CourseRow>).map((row) => {
    return {
      ...row,
      ended: row.ended === 0 ? false : true,
    } as Course;
  });

  return courses;
}

export async function getCourseByID(id: number) {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    `
    SELECT course.* , teacher.name AS teacherName
    FROM course
    JOIN teacher ON course.teacherID = teacher.id
    WHERE course.id = ?;`,
    [id]
  );
  await conn.end();

  const courses = (rows as Array<CourseRow>).map((row) => {
    return {
      ...row,
      ended: row.ended === 0 ? false : true,
    } as Course;
  });

  return courses[0];
}

export async function getCourses() {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    `
    SELECT course.*
    FROM course`
  );
  await conn.end();

  const courses = (rows as Array<CourseRow>).map((row) => {
    return {
      ...row,
      ended: row.ended === 0 ? false : true,
    } as Course;
  });

  return courses;
}

export async function getCourseStudents(coid: number): Promise<number[]> {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    `
    SELECT studentID
    FROM course_student
    WHERE courseID=?;`,
    [coid]
  );
  await conn.end();

  const students = (rows as Array<StudentIDRow>).map((row) => {
    return row.studentID
  });

  return students;
}
