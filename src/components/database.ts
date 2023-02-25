import { Pool } from 'pg';

console.log('Postgres connecting...');
const pool = new Pool();
if (!pool) {
  throw new Error('Failed to connect to datastore.');
}

type SQLParam = string | number

export default {
  query: (text: string, params: SQLParam[]) => pool.query(text, params),
};
