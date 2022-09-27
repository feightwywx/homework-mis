import { ResultSetHeader } from "mysql2";
import { getNowMySqlDateTime, createMisConnection } from "./mysql";
import { StudentHomework, Homework, HomeworkDetailContent, HomeworkStudentDetail, HomeworkTeacherDetailContent } from "./types";

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

type TeacherHomeworkDetailRow = {
  cid: number;          // ContentId
  name: string;         // 学生名
  time: string;
  completed: number;
  content: string;
  score: number;
  comment: string;
}

export async function getStudentHomeworks(id: number) {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    'SELECT homework.id, title, assignment, homework.time, deadline, completed, teacher.name ' +
    'FROM homework JOIN homework_content JOIN teacher ' +
    'ON homework.id=homework_content.id AND homework.teacherID=teacher.id ' +
    'WHERE studentID=?',
    [id]
  )
  await conn.end();
  
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
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    'SELECT homework.id, title, assignment, homework.time, deadline, teacher.name ' +
    'FROM homework JOIN teacher ' +
    'ON homework.teacherID=teacher.id ' +
    'WHERE teacherID=?',
    [id]
  )
  await conn.end();
  
  const homeworks = (rows as Array<HomeworkRow>).map((row) => {
    return {
      ...row,
      teacher: row.name
    } as Homework
  })

  return homeworks
}

export async function getHomeworkDetail(id: number) {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    'SELECT title, assignment, time, deadline ' +
    'FROM homework ' +
    'WHERE id=?',
    [id]
  )
  await conn.end();
  

  return (rows as Array<HomeworkDetailRow>).length !== 0
    ? (rows as Array<HomeworkDetailRow>)[0]
    : null;
}

export async function getStudentHomeworkDetail(hwid: number, stuid: number) {
  const hwDetail = await getHomeworkDetail(hwid)
  if (hwDetail === null) return null;

  const conn = await createMisConnection();
  const [rows] = await conn.query(
    'SELECT content, time, completed, score, comment ' +
    'FROM homework_content ' +
    'WHERE studentID=? AND homeworkID=?',
    [stuid, hwid]
  );
  await conn.end();
  
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

  const conn = await createMisConnection();
  const [rows] = await conn.query(
    'UPDATE homework_content ' +
    'SET content=?, time=?, completed=1 ' +
    'WHERE studentID=? AND homeworkID=?',
    [content, now, stuid, hwid]
  );
  await conn.end();

  return (rows as ResultSetHeader).affectedRows
}

export async function getTeacherHomeworkDetail(hwid: number, tid: number) {
  const hwDetail = await getHomeworkDetail(hwid)
  if (hwDetail === null) return null;

  const conn = await createMisConnection();
  const [rows] = await conn.query(
    'SELECT homework_content.id AS cid, student.`name`, homework_content.time, completed, content, score, comment ' +
    'FROM homework_content LEFT JOIN homework ' +
    'ON homework_content.homeworkID=homework.id ' +
    'LEFT JOIN student ON studentID=student.id ' +
    'WHERE teacherID=? AND homeworkID=?',
    [tid, hwid]
  );
  await conn.end();

  if ((rows as Array<TeacherHomeworkDetailRow>).length === 0) return null;
  const detailContentRow = (rows as Array<TeacherHomeworkDetailRow>);

  return {
    detail: hwDetail,
    content: detailContentRow.map((item) => {
      let accomplishment = undefined;
      if (item.time && item.content) {
        accomplishment = {
          time: item.time,
          content: item.content
        };
      }

      let judge = undefined;
      if (item.score || item.comment) {
        judge = {
          score: item.score,
          comment: item.comment
        }
      }

      return {
        contentId: item.cid,
        studentName: item.name,
        completed: item.completed === 0 ? false : true,
        accomplishment,
        judge
      } as HomeworkTeacherDetailContent;
    })
  }
}

export async function setReject(hwid: number) {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    'UPDATE homework_content ' +
    'SET completed=0, score=NULL ' +
    'WHERE homeworkID=?',
    [hwid]
  );
  await conn.end();

  return (rows as ResultSetHeader).affectedRows
}

export async function updateJudge(cid: number, score: number, comment: string) {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    'UPDATE homework_content ' +
    'SET score=?, comment=? ' +
    'WHERE id=?',
    [score, comment, cid]
  );
  await conn.end();

  return (rows as ResultSetHeader).affectedRows
}

export async function insertAssign(id: number, title: string, assignment: string, deadline: string) {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    'INSERT INTO homework (title, assignment, deadline, teacherID) ' +
    'VALUES (?, ?, ?, ?) ',
    [title, assignment, deadline, id]
  );
  await conn.end();

  return (rows as ResultSetHeader).insertId
}

export async function insertTarget(hwid: number, target: number) {
  const conn = await createMisConnection();
  const [rows] = await conn.query(
    'INSERT INTO homework_content (completed, studentID, homeworkID) ' +
    'VALUES (0, ?, ?) ',
    [target, hwid]
  );
  await conn.end();

  return (rows as ResultSetHeader).affectedRows
}
