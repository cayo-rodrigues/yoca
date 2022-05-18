import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGroupModel1652881030539 implements MigrationInterface {
    name = 'CreateGroupModel1652881030539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "access_level" smallint NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_728077f1b6aefc11bcd4c843fb6" UNIQUE ("access_level"), CONSTRAINT "CHK_3b0de843590a5437aef0fc1f68" CHECK ("access_level" BETWEEN 1 AND 5), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "groups"`);
    }

}
