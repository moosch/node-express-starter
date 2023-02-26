import { CustomTypesConfig, Pool } from 'pg';
import logger from '@/components/logger';

console.log('Postgres connecting...');

const pool = new Pool();
if (!pool) {
  throw new Error('Failed to connect to datastore.');
}

type SQLParam = string | number

export default {
  query: async (name: string, query: string, params: SQLParam[], types?: CustomTypesConfig) => {
    logger.info(`Performing query: ${name}`);

    const client = await pool.connect();
    const result = await client.query({
      text: query,
      values: params,
      rowMode: 'array',
      types,
    });
    await client.end();

    return result;
  },
  // connect: (err, client, done) => pool.connect(err, client, done),
};
