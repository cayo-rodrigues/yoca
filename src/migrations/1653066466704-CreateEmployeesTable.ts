import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateEmployeesTable1653066466704 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: "employees",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            length: "164",
          },
          {
            name: "phone",
            type: "varchar",
            length: "15",
            isUnique: true,
          },
          {
            name: "email",
            type: "varchar",
            length: "164",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
          },
          {
            name: "accessLevel",
            type: "int2",
          },
          {
            name: "createdAt",
            type: "timestamptz",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamptz",
            default: "now()",
          },
          {
            name: "deletedAt",
            type: "timestamptz",
            isNullable: true,
            default: null,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("employees");
  }
}
