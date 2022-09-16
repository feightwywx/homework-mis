import { createConnection } from 'mysql2/promise';

export const sqlConnection = createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'homework_mis'
})
