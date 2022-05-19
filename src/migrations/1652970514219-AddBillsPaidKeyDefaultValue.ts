import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBillsPaidKeyDefaultValue1652970514219 implements MigrationInterface {
    name = 'AddBillsPaidKeyDefaultValue1652970514219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bills" ALTER COLUMN "paid" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bills" ALTER COLUMN "paid" DROP DEFAULT`);
    }

}
