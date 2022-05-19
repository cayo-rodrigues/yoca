import { MigrationInterface, QueryRunner } from "typeorm";

export class FixBillIdType1652999187536 implements MigrationInterface {
    name = 'FixBillIdType1652999187536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_6e9dd6d9b26fcf2eca11ff60f7e"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "bill_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "bill_id" integer`);
        await queryRunner.query(`ALTER TABLE "bills" DROP CONSTRAINT "PK_a56215dfcb525755ec832cc80b7"`);
        await queryRunner.query(`ALTER TABLE "bills" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "bills" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bills" ADD CONSTRAINT "PK_a56215dfcb525755ec832cc80b7" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_6e9dd6d9b26fcf2eca11ff60f7e" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_6e9dd6d9b26fcf2eca11ff60f7e"`);
        await queryRunner.query(`ALTER TABLE "bills" DROP CONSTRAINT "PK_a56215dfcb525755ec832cc80b7"`);
        await queryRunner.query(`ALTER TABLE "bills" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "bills" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "bills" ADD CONSTRAINT "PK_a56215dfcb525755ec832cc80b7" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "bill_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "bill_id" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_6e9dd6d9b26fcf2eca11ff60f7e" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
