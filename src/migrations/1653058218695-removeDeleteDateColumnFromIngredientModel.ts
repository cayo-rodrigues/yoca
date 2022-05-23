import { MigrationInterface, QueryRunner } from "typeorm";

export class removeDeleteDateColumnFromIngredientModel1653058218695 implements MigrationInterface {
    name = 'removeDeleteDateColumnFromIngredientModel1653058218695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" DROP COLUMN "deleted_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    }

}
