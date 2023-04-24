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
