import { MigrationInterface, QueryRunner } from "typeorm";

export class addDeleteDateColumnToIngredientModel1653057877298 implements MigrationInterface {
    name = 'addDeleteDateColumnToIngredientModel1653057877298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" DROP COLUMN "deleted_at"`);
    }

}
