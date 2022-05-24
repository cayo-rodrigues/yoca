import { DataSource } from "typeorm";

interface TableNames {
  table_name: string;
}

export async function clearDB(connection: DataSource) {
  const tableNames: TableNames[] = await connection.query(`SELECT
    table_name
  FROM
    information_schema.tables
  WHERE
      table_name <> 'migrations'
      AND table_name <> 'typeorm_metadata'
    AND table_schema = 'public'`);

  tableNames.forEach(async ({ table_name }) => {
    await connection.query(`DELETE FROM ${table_name}`);
  });
}
