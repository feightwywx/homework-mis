import { createMisConnection } from "./mysql";

type nameRow = {
  name: string
}

type idRow = {
  id: number
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
