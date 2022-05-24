import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBillsTable1653066243471 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "bills",
        columns: [
          {
            name: "id",
            type: "bigserial",
            isPrimary: true,
            generationStrategy: "increment",
          },
          {
            name: "paid",
            type: "boolean",
            default: false,
          },
          {
            name: "total",
            type: "decimal",
            precision: 8,
            scale: 2,
            default: 0,
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
    await queryRunner.dropTable("bills");
  }
}
