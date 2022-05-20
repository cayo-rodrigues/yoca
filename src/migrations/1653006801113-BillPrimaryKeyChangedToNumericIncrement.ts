import { MigrationInterface, QueryRunner } from "typeorm";

export class BillPrimaryKeyChangedToNumericIncrement1653006801113 implements MigrationInterface {
    name = 'BillPrimaryKeyChangedToNumericIncrement1653006801113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_909d1f3b7aa95c03d9e3a40840c"`);
        // await queryRunner.query(`ALTER TABLE "employees" RENAME COLUMN "groupId" TO "access_level"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "access_level"`);
        await queryRunner.query(`ALTER TABLE "employees" ADD "access_level" smallint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_6e9dd6d9b26fcf2eca11ff60f7e"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "bill_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "bill_id" bigint`);
        await queryRunner.query(`ALTER TABLE "bills" DROP CONSTRAINT "PK_a56215dfcb525755ec832cc80b7"`);
        await queryRunner.query(`ALTER TABLE "bills" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "bills" ADD "id" BIGSERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bills" ADD CONSTRAINT "PK_a56215dfcb525755ec832cc80b7" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "CHK_9f210fcb59a27290211cd41cbe" CHECK ("access_level" BETWEEN 1 AND 5)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_6e9dd6d9b26fcf2eca11ff60f7e" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_6e9dd6d9b26fcf2eca11ff60f7e"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "CHK_9f210fcb59a27290211cd41cbe"`);
        await queryRunner.query(`ALTER TABLE "bills" DROP CONSTRAINT "PK_a56215dfcb525755ec832cc80b7"`);
        await queryRunner.query(`ALTER TABLE "bills" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "bills" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "bills" ADD CONSTRAINT "PK_a56215dfcb525755ec832cc80b7" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "bill_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "bill_id" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_6e9dd6d9b26fcf2eca11ff60f7e" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "access_level"`);
        await queryRunner.query(`ALTER TABLE "employees" ADD "access_level" uuid`);
        await queryRunner.query(`ALTER TABLE "employees" RENAME COLUMN "access_level" TO "groupId"`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_909d1f3b7aa95c03d9e3a40840c" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
