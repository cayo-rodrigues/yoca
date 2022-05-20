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
            name: "employee_id",
            type: "uuid",
          },
          {
            name: "bill_id",
            type: "bigint",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "deleted_at",
            type: "timestamp",
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
