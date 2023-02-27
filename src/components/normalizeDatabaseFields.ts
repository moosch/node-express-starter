import { QueryArrayResult } from 'pg';

// Converts query response to a POJO.
const normalizeFields = (result: QueryArrayResult): any[] => {
  if (result.rowCount == 0) return [];

  return result.rows.map((row) =>
    row.reduce((acc, item, i) => {
      acc[result.fields[i].name] = item;
      return acc;
    }, {} as any[]),
  );
}

export default normalizeFields;
