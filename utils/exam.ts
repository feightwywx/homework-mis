import { ResultSetHeader } from "mysql2";
import { createMisConnection } from "./mysql";
import { Exam, ExamResult } from "./types";

type ExamRow = {
  id: number;
  name: string;
  time: string;
  endtime: string;
  location: string;
  courseID: number;
};

type ExamResultRow = {
  score: number | null;
};
type DetailedExamResultRow = ExamResultRow & {
  id: number;
  studentID: number;
  studentName: string;
};

export async function getExamsByCourseID(coid: number): Promise<Exam[]> {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    `
    SELECT *
    FROM exam
    WHERE courseID=?`,
    [coid]
  );
  await conn.end();

  const exams = rows as Array<ExamRow>;

  return exams;
}

export async function getExamByID(eid: number): Promise<Exam> {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    `
    SELECT *
    FROM exam
    WHERE id=?`,
    [eid]
  );
  await conn.end();

  const exams = (rows as Array<ExamRow>)[0];

  return exams;
}

export async function getStudentExamScore(
  uid: number,
  eid: number
): Promise<number | null> {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    `
    SELECT score
    FROM exam_result
    WHERE studentID=? AND examID=?;`,
    [uid, eid]
  );
  await conn.end();

  const score = (rows as Array<ExamResultRow>)[0].score;
  console.log("score", score);

  return score;
}

export async function getTeacherExamScore(eid: number): Promise<ExamResult[]> {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    `
    SELECT exam_result.id, studentID, student.name AS studentName, score
    FROM exam_result
    JOIN student ON student.id = exam_result.studentID
    WHERE exam_result.examID = ?;`,
    [eid]
  );
  await conn.end();

  const score = rows as Array<DetailedExamResultRow>;

  return score;
}

export async function updateExamScore(
  erid: number,
  score: number
): Promise<number> {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    `UPDATE exam_result SET score=? WHERE id=?;`,
    [score, erid]
  );
  await conn.end();

  return (rows as ResultSetHeader).affectedRows;
}

export async function insertExamAssign(courseID: number, title: string, location: string, time: string, endtime: string) {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    'INSERT INTO exam (name, location, time, endtime, courseID) ' +
    'VALUES (?, ?, ?, ?, ?) ',
    [title, location, time, endtime, courseID]
  );
  await conn.end();

  return (rows as ResultSetHeader).insertId
}

export async function insertExamTarget(studentID: number, examID: number) {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    'INSERT INTO exam_result (studentID, examID) ' +
    'VALUES (?, ?) ',
    [studentID, examID]
  );
  await conn.end();

  return (rows as ResultSetHeader).affectedRows
}
