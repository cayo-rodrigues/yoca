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
exports.CreateBillsTable1653066243471 = void 0;
const typeorm_1 = require("typeorm");
class CreateBillsTable1653066243471 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "bills",
                columns: [
                    {
                        name: "id",
                        type: "bigserial",
                        isPrimary: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "paid",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "total",
                        type: "decimal",
                        precision: 8,
                        scale: 2,
                        default: 0,
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
            yield queryRunner.dropTable("bills");
        });
    }
}
exports.CreateBillsTable1653066243471 = CreateBillsTable1653066243471;
