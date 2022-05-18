import { MigrationInterface, QueryRunner } from "typeorm";

export class RelateManyOrdersToOneEmployee1652901913811 implements MigrationInterface {
    name = 'RelateManyOrdersToOneEmployee1652901913811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_feedbacks" DROP CONSTRAINT "FK_c3cd7a26554c46bbb0bc8a0ae77"`);
        await queryRunner.query(`ALTER TABLE "product_feedbacks" DROP COLUMN "productIdId"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "employee_id" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_f8a7411077c731327ca6e0b93b6" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_f8a7411077c731327ca6e0b93b6"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "product_feedbacks" ADD "productIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "product_feedbacks" ADD CONSTRAINT "FK_c3cd7a26554c46bbb0bc8a0ae77" FOREIGN KEY ("productIdId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
