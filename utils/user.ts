import { createMisConnection } from "./mysql";

type nameRow = {
  name: string
}

type idRow = {
  id: number
}

type classRow = {
  class: string
}

type studentRow = {
  id: number,
  name: string
}

export async function getNameByToken(usertype: string, token: string) {
  const selectQuery = `SELECT name FROM ${usertype} WHERE token=?`

  const conn = await createMisConnection()
  const [rows] = await conn.query(
    selectQuery, [token]
  )
  await conn.end();

  if ((rows as Array<nameRow>).length === 0) {
    return null;
  } else {
    return (rows as Array<nameRow>)[0].name;
  }

}

export async function getId(usertype: string, token: string) {
  const selectQuery = `SELECT id FROM ${usertype} WHERE token=?`

  const conn = await createMisConnection();
  const [rows] = await conn.query(
    selectQuery, [token]
  )
  await conn.end();

  if ((rows as Array<idRow>).length === 0) {
    return null;
  } else {
    return (rows as Array<idRow>)[0].id;
  }
}

export async function getStudentId(name: string) {
  const conn = await createMisConnection()
  const [rows] = await conn.query(
    `SELECT id FROM student WHERE name=?`, [name]
  )
  await conn.end();

  if ((rows as Array<idRow>).length === 0) {
    return null;
  } else {
    return (rows as Array<idRow>)[0].id;
  }
}

export async function getTeacherName(id: number) {
  const conn = await createMisConnection()
  const [rows] = await conn.query(
    `SELECT name FROM teacher WHERE id=?`, [id]
  )
  await conn.end();

  if ((rows as Array<nameRow>).length === 0) {
    return null;
  } else {
    return (rows as Array<nameRow>)[0].name;
  }
}

export async function getAllClasses() {
  const conn = await createMisConnection()
  const [rows] = await conn.query(
    `SELECT DISTINCT class FROM student`
  )
  await conn.end();

  return (rows as Array<classRow>)
}

export async function getStudentByClass(className: string) {
  const conn = await createMisConnection()
  const [rows] = await conn.query(
    'SELECT id, name FROM student WHERE class=?', [className]
  )
  await conn.end();

  return (rows as Array<studentRow>)
}
