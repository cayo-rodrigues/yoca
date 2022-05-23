import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateGeneralFeedbacksTable1653066533081
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: "general_feedbacks",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "description",
            type: "text",
          },
          {
            name: "rating",
            type: "int2",
          },
          {
            name: "createdAt",
            type: "text",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "text",
            default: "now()",
          },
          {
            name: "deletedAt",
            type: "text",
            isNullable: true,
            default: null,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("general_feedbacks");
  }
}
