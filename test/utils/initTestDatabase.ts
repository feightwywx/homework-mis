import { readFile } from 'fs/promises';
import { createMisConnection } from "../../utils/mysql";

export async function initTestDatabase() {
  const conn = await createMisConnection();
  // cwd is root
  const sql = await readFile('./sql/homework_mis_with_data.sql', 'utf-8');
  await conn.query(sql);
  conn.end();
}