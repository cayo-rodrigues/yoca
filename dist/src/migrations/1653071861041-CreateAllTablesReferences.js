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
exports.CreateAllTablesReferences1653071861041 = void 0;
const typeorm_1 = require("typeorm");
class CreateAllTablesReferences1653071861041 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createForeignKey("orders", new typeorm_1.TableForeignKey({
                name: "employeesFK",
                columnNames: ["employeeId"],
                referencedColumnNames: ["id"],
                referencedTableName: "employees",
            }));
            yield queryRunner.createForeignKey("orders", new typeorm_1.TableForeignKey({
                name: "billsFK",
                columnNames: ["billId"],
                referencedColumnNames: ["id"],
                referencedTableName: "bills",
            }));
            yield queryRunner.createForeignKey("orders_products", new typeorm_1.TableForeignKey({
                name: "ordersFK",
                columnNames: ["orderId"],
                referencedColumnNames: ["id"],
                referencedTableName: "orders",
            }));
            yield queryRunner.createForeignKey("orders_products", new typeorm_1.TableForeignKey({
                name: "productsFK",
                columnNames: ["productId"],
                referencedColumnNames: ["id"],
                referencedTableName: "products",
                onDelete: "SET NULL",
            }));
            yield queryRunner.createForeignKey("product_feedbacks", new typeorm_1.TableForeignKey({
                name: "productsFK",
                columnNames: ["productId"],
                referencedColumnNames: ["id"],
                referencedTableName: "products",
                onDelete: "SET NULL",
            }));
            yield queryRunner.createForeignKey("products_ingredients", new typeorm_1.TableForeignKey({
                name: "productsFK",
                columnNames: ["productId"],
                referencedColumnNames: ["id"],
                referencedTableName: "products",
                onDelete: "SET NULL",
            }));
            yield queryRunner.createForeignKey("products_ingredients", new typeorm_1.TableForeignKey({
                name: "ingredientsFK",
                columnNames: ["ingredientId"],
                referencedColumnNames: ["id"],
                referencedTableName: "ingredients",
                onDelete: "SET NULL",
            }));
            yield queryRunner.createForeignKey("products_categories", new typeorm_1.TableForeignKey({
                name: "productsFK",
                columnNames: ["productId"],
                referencedColumnNames: ["id"],
                referencedTableName: "products",
                onDelete: "SET NULL",
            }));
            yield queryRunner.createForeignKey("products_categories", new typeorm_1.TableForeignKey({
                name: "categoriesFK",
                columnNames: ["categoryId"],
                referencedColumnNames: ["id"],
                referencedTableName: "categories",
                onDelete: "SET NULL",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropForeignKey("orders", "employeesFK");
            yield queryRunner.dropForeignKey("orders", "billsFK");
            yield queryRunner.dropForeignKey("orders_products", "ordersFK");
            yield queryRunner.dropForeignKey("orders_products", "productsFK");
            yield queryRunner.dropForeignKey("product_feedbacks", "productsFK");
            yield queryRunner.dropForeignKey("products_ingredients", "productsFK");
            yield queryRunner.dropForeignKey("products_ingredients", "ingredientsFK");
            yield queryRunner.dropForeignKey("products_categories", "productsFK");
            yield queryRunner.dropForeignKey("products_categories", "categoriesFK");
        });
    }
}
exports.CreateAllTablesReferences1653071861041 = CreateAllTablesReferences1653071861041;
