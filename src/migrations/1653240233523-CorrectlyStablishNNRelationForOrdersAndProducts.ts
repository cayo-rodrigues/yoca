import { MigrationInterface, QueryRunner } from "typeorm";

export class CorrectlyStablishNNRelationForOrdersAndProducts1653240233523 implements MigrationInterface {
    name = 'CorrectlyStablishNNRelationForOrdersAndProducts1653240233523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_products" DROP CONSTRAINT "FK_266b0df20b9e4423bc9da1bbdc1"`);
        await queryRunner.query(`ALTER TABLE "orders_products" DROP CONSTRAINT "FK_beb618ce6dae64b9d817394ebdb"`);
        await queryRunner.query(`ALTER TABLE "orders_products" DROP COLUMN "order_id"`);
        await queryRunner.query(`ALTER TABLE "orders_products" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "orders_products" ADD "orderId" uuid`);
        await queryRunner.query(`ALTER TABLE "orders_products" ADD "productId" uuid`);
        await queryRunner.query(`ALTER TABLE "orders_products" ADD CONSTRAINT "FK_823bad3524a5d095453c43286bb" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders_products" ADD CONSTRAINT "FK_4eff63e89274f79195e25c5c115" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_products" DROP CONSTRAINT "FK_4eff63e89274f79195e25c5c115"`);
        await queryRunner.query(`ALTER TABLE "orders_products" DROP CONSTRAINT "FK_823bad3524a5d095453c43286bb"`);
        await queryRunner.query(`ALTER TABLE "orders_products" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "orders_products" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "orders_products" ADD "product_id" uuid`);
        await queryRunner.query(`ALTER TABLE "orders_products" ADD "order_id" uuid`);
        await queryRunner.query(`ALTER TABLE "orders_products" ADD CONSTRAINT "FK_beb618ce6dae64b9d817394ebdb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders_products" ADD CONSTRAINT "FK_266b0df20b9e4423bc9da1bbdc1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
