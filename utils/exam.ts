import { createMisConnection } from "./mysql";
import { Exam } from "./types";

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
}

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

  const exams = (rows as Array<ExamRow>);

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

export async function getExamScore(uid: number, eid: number): Promise<number | null> {
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
  console.log('score', score);

  return score;
}
