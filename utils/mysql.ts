import { createConnection } from 'mysql2/promise';

export async function createMisConnection() {
  const port = process.env.MYSQL_PORT ? +(process.env.MYSQL_PORT) : 3306

  return createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: port,
    database: 'homework_mis',
    multipleStatements: true,
  })
}

export async function getNowMySqlDateTime() {
  const date = new Date()
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
