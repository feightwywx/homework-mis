import { createPool } from 'mysql2/promise';
import { createConnection } from 'mysql2/promise';

export async function createMisConn() {
  return createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'homework_mis'
  })
}

export const sqlPool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'homework_mis'
})

export async function getNowMySqlDateTime() {
  const date = new Date()
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
