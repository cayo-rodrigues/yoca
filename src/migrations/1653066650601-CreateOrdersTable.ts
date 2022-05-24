import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOrdersTable1653066650601 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: "orders",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "table",
            type: "varchar",
            length: "3",
          },
          {
            name: "status",
            type: "varchar",
          },
          {
            name: "total",
            type: "decimal",
            precision: 8,
            scale: 2,
          },
          {
            name: "employeeId",
            type: "uuid",
          },
          {
            name: "billId",
            type: "bigint",
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
    await queryRunner.dropTable("orders");
  }
}
