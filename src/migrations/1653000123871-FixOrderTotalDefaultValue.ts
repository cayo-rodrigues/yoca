import { MigrationInterface, QueryRunner } from "typeorm";

export class FixOrderTotalDefaultValue1653000123871 implements MigrationInterface {
    name = 'FixOrderTotalDefaultValue1653000123871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "total" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "total" DROP DEFAULT`);
    }

}
