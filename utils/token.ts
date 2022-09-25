import { UserType } from "./types";
import { randomBytes } from 'crypto';
import { sqlPool } from "./mysql";

type TokenRow = {
  token: string
}

export async function generateToken() {
  return randomBytes(48).toString('hex')
}

export async function getToken(username: string, password: string, usertype: UserType) {
  const selectQuery = `SELECT token FROM ${usertype} WHERE actual_id=? AND password=?`
  const updateQuery = `UPDATE ${usertype} SET token=? WHERE actual_id=?`

  const conn = await sqlPool.getConnection();
  const [rows] = await conn.execute(
    selectQuery, [username, password]
  )
  conn.release();

  if ((rows as Array<TokenRow>).length !== 0) {         // 账号密码匹配
    const token = (rows as Array<TokenRow>)[0].token
    if (token !== null) {                               // token存在，直接返回
      return (rows as Array<TokenRow>)[0].token
    } else {                                            // token不存在，生成token存入数据库
      const newToken = await generateToken();  
      const conn = await sqlPool.getConnection();         // 然后返回新的token
      const [] = await conn.execute(
        updateQuery, [newToken, username]
      )
      conn.release();
      return newToken;
    }
  } else {                                              // 账号密码不匹配
    return null;
  }
}
