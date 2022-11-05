"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIngredientsTable1653066599808 = void 0;
const typeorm_1 = require("typeorm");
class CreateIngredientsTable1653066599808 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "ingredients",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "164",
                        isUnique: true,
                    },
                    {
                        name: "measure",
                        type: "varchar",
                        length: "3",
                    },
                    {
                        name: "amount",
                        type: "decimal",
                        precision: 8,
                        scale: 2,
                    },
                    {
                        name: "amountMin",
                        type: "decimal",
                        precision: 8,
                        scale: 2,
                    },
                    {
                        name: "amountMax",
                        type: "decimal",
                        precision: 8,
                        scale: 2,
                    },
                    {
                        name: "createdAt",
                        type: "timestamptz",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamptz",
                        default: "now()",
                    },
                ],
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable("ingredients");
        });
    }
}
exports.CreateIngredientsTable1653066599808 = CreateIngredientsTable1653066599808;
