import { MigrationInterface, QueryRunner } from "typeorm";

export class RelateManyEmployeesToOneGroup1652889869094 implements MigrationInterface {
    name = 'RelateManyEmployeesToOneGroup1652889869094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" ADD "accessLevelId" uuid`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_8c2fe7e6f645b0f199efab35317" FOREIGN KEY ("accessLevelId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_8c2fe7e6f645b0f199efab35317"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "accessLevelId"`);
    }

}
