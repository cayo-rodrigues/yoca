import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateIngredientsTable1653066599808 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: "ingredients",
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
            isUnique: true,
          },
          {
            name: "measure",
            type: "varchar",
            length: "3",
          },
          {
            name: "amount",
            type: "decimal",
            precision: 8,
            scale: 2,
          },
          {
            name: "amount_min",
            type: "decimal",
            precision: 8,
            scale: 2,
          },
          {
            name: "amount_max",
            type: "decimal",
            precision: 8,
            scale: 2,
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
    await queryRunner.dropTable("ingredients");
  }
}
