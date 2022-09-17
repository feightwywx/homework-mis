import { sqlConnection } from "./mysql";

type nameRow = {
  name: string
}

export async function getName(usertype: string, token: string) {
  const selectQuery = `SELECT name FROM ${usertype} WHERE token=?`

  const [rows] = await (await sqlConnection).execute(
    selectQuery, [token]
  )
  
  if ((rows as Array<nameRow>).length === 0) {
    return null;
  } else {
    return (rows as Array<nameRow>)[0].name;
  }
  
}
