import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductsCategoriesTable1653071442064
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: "products_categories",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "productId",
            type: "uuid",
          },
          {
            name: "categoryId",
            type: "uuid",
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
    await queryRunner.dropTable("products_categories");
  }
}
