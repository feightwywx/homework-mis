import { createConnection } from 'mysql2/promise';

export async function createMisConn() {
  return createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'homework_mis'
  })
}
