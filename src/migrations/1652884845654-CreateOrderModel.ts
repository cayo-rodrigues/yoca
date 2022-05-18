import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderModel1652884845654 implements MigrationInterface {
    name = 'CreateOrderModel1652884845654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(164) NOT NULL, "measure" character varying(3) NOT NULL, "amount" numeric(8,2) NOT NULL, "amount_min" numeric(8,2) NOT NULL, "amount_max" numeric(8,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a955029b22ff66ae9fef2e161f8" UNIQUE ("name"), CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "access_level" smallint NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_728077f1b6aefc11bcd4c843fb6" UNIQUE ("access_level"), CONSTRAINT "CHK_3b0de843590a5437aef0fc1f68" CHECK ("access_level" BETWEEN 1 AND 5), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Order_status_enum" AS ENUM('pending', 'ready', 'served')`);
        await queryRunner.query(`CREATE TABLE "Order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "table" character varying(3) NOT NULL, "status" "public"."Order_status_enum" NOT NULL DEFAULT 'pending', "total" numeric(8,2) NOT NULL, CONSTRAINT "PK_3d5a3861d8f9a6db372b2b317b7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Order"`);
        await queryRunner.query(`DROP TYPE "public"."Order_status_enum"`);
        await queryRunner.query(`DROP TABLE "groups"`);
        await queryRunner.query(`DROP TABLE "ingredients"`);
    }

}
