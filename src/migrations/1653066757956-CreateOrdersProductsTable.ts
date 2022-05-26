import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOrdersProductsTable1653066757956
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: "orders_products",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "quantity",
            type: "integer",
            default: 1,
          },
          {
            name: "totalPrice",
            type: "decimal",
            precision: 8,
            scale: 2,
            default: 0,
          },
          {
            name: "orderId",
            type: "uuid",
          },
          {
            name: "productId",
            type: "uuid",
            isNullable: true,
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
    await queryRunner.dropTable("orders_products");
  }
}
