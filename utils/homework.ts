import { createMisConn } from "./mysql";
import parseMysqlDateTime from "./parseTime";
import { StudentHomework, Homework } from "./types";
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

export async function getStudentHomework(id: number) {
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

export async function getTeacherHomework(id: number) {
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
