import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAllModelsWithoutRelationships1652889633839 implements MigrationInterface {
    name = 'CreateAllModelsWithoutRelationships1652889633839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "general_feedbacks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying(512) NOT NULL, "rating" smallint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "CHK_fb480b9c2e5be22eb83e4534b3" CHECK ("rating" BETWEEN 1 AND 5), CONSTRAINT "PK_817f8d8f2822c25ebaf95c17544" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paid" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a56215dfcb525755ec832cc80b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(164) NOT NULL, "phone" character varying(15) NOT NULL, "email" character varying(164) NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_cbc362d1c574464a63d3acc3ead" UNIQUE ("phone"), CONSTRAINT "UQ_765bc1ac8967533a04c74a9f6af" UNIQUE ("email"), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(164) NOT NULL, "measure" character varying(3) NOT NULL, "amount" numeric(8,2) NOT NULL, "amount_min" numeric(8,2) NOT NULL, "amount_max" numeric(8,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a955029b22ff66ae9fef2e161f8" UNIQUE ("name"), CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'ready', 'served')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "table" character varying(3) NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending', "total" numeric(8,2) NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(164) NOT NULL, "price" numeric(8,2) NOT NULL, "calories" numeric(11,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4c9fb58de893725258746385e16" UNIQUE ("name"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_feedbacks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying(512) NOT NULL, "rating" smallint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "CHK_a6c3cf1bce24fff2c98fdfd876" CHECK ("rating" BETWEEN 1 AND 5), CONSTRAINT "PK_137209d7e486adfc8b85688b4c5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product_feedbacks"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "ingredients"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TABLE "bills"`);
        await queryRunner.query(`DROP TABLE "general_feedbacks"`);
    }

}
