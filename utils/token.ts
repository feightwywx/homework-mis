import { UserType } from "../pages/api/user";
import { sqlConnection } from './mysql';
import { randomBytes } from 'crypto';

type TokenRow = {
  token: string
}

export async function generateToken() {
  return randomBytes(48).toString('hex')
}

export async function getToken(username: string, password: string, usertype: UserType) {
  const selectQuery = `SELECT token FROM ${usertype} WHERE actual_id=? AND password=?`
  const updateQuery = `UPDATE ${usertype} SET token=? WHERE actual_id=?`

  const [rows] = await (await sqlConnection).execute(
    selectQuery, [username, password]
  )

  if ((rows as Array<TokenRow>).length !== 0) {         // 账号密码匹配
    const token = (rows as Array<TokenRow>)[0].token
    if (token !== null) {                               // token存在，直接返回
      return (rows as Array<TokenRow>)[0].token
    } else {                                            // token不存在，生成token存入数据库
      const newToken = await generateToken();           // 然后返回新的token
      console.log(newToken);
      const [] = await (await sqlConnection).execute(
        updateQuery, [newToken, username]
      )
      return newToken;
    }
  } else {                                              // 账号密码不匹配
    return null;
  }
}
