import { ResultSetHeader } from "mysql2";
import { createMisConn, getNowMySqlDateTime } from "./mysql";
import parseMysqlDateTime from "./parseTime";
import { StudentHomework, Homework, HomeworkDetailContent, HomeworkStudentDetail } from "./types";
import { getNameByToken, getTeacherName } from "./user";

type StudentHomeworkRow = {
  id: number;
  title: string;
  assignment: string;
  time: string;
  deadline: string;
  completed: number;
  name: string;
}

type HomeworkRow = {
  id: number;
  title: string;
  assignment: string;
  time: string;
  deadline: string;
  name: string;
}

type HomeworkDetailRow = {
  title: string;
  assignment: string;
  time: string;
  deadline: string;
}

type HomeworkDetailContentRow = {
  completed: number;
  time: string;
  content: string;
  score: number;
  comment: string;
}

export async function getStudentHomeworks(id: number) {
  const conn = await createMisConn();
  const [rows] = await conn.execute(
    'SELECT homework.id, title, assignment, homework.time, deadline, completed, teacher.name ' +
    'FROM homework JOIN homework_content JOIN teacher ' +
    'ON homework.id=homework_content.id AND homework.teacherID=teacher.id ' +
    'WHERE studentID=?',
    [id]
  )
  conn.destroy();
  const homeworks = (rows as Array<StudentHomeworkRow>).map((row) => {
    return {
      ...row,
      completed: row.completed === 0 ? false : true,
      teacher: row.name
    } as StudentHomework
  })

  return homeworks
}

export async function getTeacherHomeworks(id: number) {
  const conn = await createMisConn();
  const [rows] = await conn.execute(
    'SELECT homework.id, title, assignment, homework.time, deadline, teacher.name ' +
    'FROM homework JOIN teacher ' +
    'ON homework.teacherID=teacher.id ' +
    'WHERE teacherID=?',
    [id]
  )
  conn.destroy();
  const homeworks = (rows as Array<HomeworkRow>).map((row) => {
    return {
      ...row,
      teacher: row.name
    } as Homework
  })

  return homeworks
}

export async function getHomeworkDetail(id: number) {
  const conn = await createMisConn();
  const [rows] = await conn.execute(
    'SELECT title, assignment, time, deadline ' +
    'FROM homework ' +
    'WHERE id=?',
    [id]
  )
  conn.destroy();

  return (rows as Array<HomeworkDetailRow>).length !== 0
    ? (rows as Array<HomeworkDetailRow>)[0]
    : null;
}

export async function getStudentHomeworkDetail(hwid: number, stuid: number) {
  const hwDetail = await getHomeworkDetail(hwid)
  if (hwDetail === null) return null;

  const conn = await createMisConn();
  const [rows] = await conn.execute(
    'SELECT content, time, completed, score, comment ' +
    'FROM homework_content ' +
    'WHERE studentID=? AND homeworkID=?',
    [stuid, hwid]
  );
  conn.destroy();
  if ((rows as Array<HomeworkDetailContentRow>).length === 0) return null;
  const detailContentRow = (rows as Array<HomeworkDetailContentRow>)[0];
  
  let accomplishment = undefined;
  if (detailContentRow.time && detailContentRow.content) {
    accomplishment = {
      time: detailContentRow.time,
      content: detailContentRow.content
    };
  }
  
  let judge = undefined;
  if (detailContentRow.score) {
    judge = {
      score: detailContentRow.score,
      comment: detailContentRow.comment
    }
  }

  const result = {
    detail: hwDetail,
    content: {
      completed: detailContentRow.completed === 0 ? false : true,
      accomplishment,
      judge
    } as HomeworkDetailContent
  } as HomeworkStudentDetail;

  return result;
}

export async function updateHomework(hwid: number, stuid: number, content: string) {
  const now = await getNowMySqlDateTime();
  
  const conn = await createMisConn();
  const [rows] = await conn.execute(
    'UPDATE homework_content ' +
    'SET content=?, time=?, completed=1 ' +
    'WHERE studentID=? AND homeworkID=?',
    [content, now, stuid, hwid]
  );
  conn.destroy();
  
  return (rows as ResultSetHeader).affectedRows
}
