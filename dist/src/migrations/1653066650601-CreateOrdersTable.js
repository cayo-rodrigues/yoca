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
exports.CreateOrdersTable1653066650601 = void 0;
const typeorm_1 = require("typeorm");
class CreateOrdersTable1653066650601 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "orders",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "table",
                        type: "varchar",
                        length: "3",
                    },
                    {
                        name: "status",
                        type: "varchar",
                    },
                    {
                        name: "total",
                        type: "decimal",
                        precision: 8,
                        scale: 2,
                    },
                    {
                        name: "employeeId",
                        type: "uuid",
                    },
                    {
                        name: "billId",
                        type: "bigint",
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
                    {
                        name: "deletedAt",
                        type: "timestamptz",
                        isNullable: true,
                        default: null,
                    },
                ],
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable("orders");
        });
    }
}
exports.CreateOrdersTable1653066650601 = CreateOrdersTable1653066650601;
