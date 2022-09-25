import { sqlPool } from "./mysql";

type nameRow = {
  name: string
}

type idRow = {
  id: number
}

export async function getNameByToken(usertype: string, token: string) {
  const selectQuery = `SELECT name FROM ${usertype} WHERE token=?`

  const conn = await sqlPool.getConnection()
  const [rows] = await conn.execute(
    selectQuery, [token]
  )
  conn.release();

  if ((rows as Array<nameRow>).length === 0) {
    return null;
  } else {
    return (rows as Array<nameRow>)[0].name;
  }

}

export async function getId(usertype: string, token: string) {
  const selectQuery = `SELECT id FROM ${usertype} WHERE token=?`

  const conn = await sqlPool.getConnection();
  const [rows] = await conn.execute(
    selectQuery, [token]
  )
  conn.release();

  if ((rows as Array<idRow>).length === 0) {
    return null;
  } else {
    return (rows as Array<idRow>)[0].id;
  }
}

export async function getTeacherName(id: number) {
  const conn = await sqlPool.getConnection()
  const [rows] = await conn.execute(
    `SELECT name FROM teacher WHERE id=?`, [id]
  )
  conn.release();

  if ((rows as Array<nameRow>).length === 0) {
    return null;
  } else {
    return (rows as Array<nameRow>)[0].name;
  }

}
