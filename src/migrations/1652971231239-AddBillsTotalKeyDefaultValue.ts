import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBillsTotalKeyDefaultValue1652971231239 implements MigrationInterface {
    name = 'AddBillsTotalKeyDefaultValue1652971231239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bills" ALTER COLUMN "total" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bills" ALTER COLUMN "total" DROP DEFAULT`);
    }

}
