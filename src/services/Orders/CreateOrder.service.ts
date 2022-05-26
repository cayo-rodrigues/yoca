import { In } from "typeorm";
import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { ICreateOrder } from "../../interfaces/Orders.interface";
import Bill from "../../models/Bill.model";
import Employee from "../../models/Employee.model";
import Ingredient from "../../models/Ingredient.model";
import Order from "../../models/Order.model";
import OrderProduct from "../../models/OrdersProducts.model";
import Product from "../../models/Product.model";
import { IIngredientsArray } from "../../interfaces/Orders.interface";

class CreateOrderService {
  static async execute({
    ordersProducts,
    table,
    employeeId,
    billId,
  }: ICreateOrder) {
    const orderRepo = AppDataSource.getRepository(Order);
    const productsRepo = AppDataSource.getRepository(Product);
    const employeeRepo = AppDataSource.getRepository(Employee);
    const orderProductRepo = AppDataSource.getRepository(OrderProduct);
    const billsRepo = AppDataSource.getRepository(Bill);
    const ingredientsRepo = AppDataSource.getRepository(Ingredient);

    const employee = await employeeRepo.findOneBy({
      id: employeeId,
    });

    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    const bill = await billsRepo.findOneBy({
      id: billId,
    });

    if (!bill) {
      throw new AppError("Bill not found", 404);
    }

    if (bill.paid) {
      throw new AppError("Bill is already paid", 400);
    }

    const productsIds = ordersProducts.map(({ productId }) => productId);

    const toFindDuplicates = productsIds.filter(
      (item, index) => productsIds.indexOf(item) !== index
    );

    if (toFindDuplicates.length > 0) {
      throw new AppError("Duplicate products id", 400);
    }

    const products = await productsRepo.findBy({
      id: In(productsIds),
    });

    if (products.length !== productsIds.length) {
      throw new AppError("Invalid list of ids", 400);
    }

    const productsIngredientsInfo = products.map((product) => {
      return product.ingredients.map((productIngredient) => {
        return {
          ingredientId: productIngredient.ingredientId,
          amount: productIngredient.amount,
        };
      });
    });

    const ingredientsAcc: IIngredientsArray[] = [];

    productsIngredientsInfo.flat().forEach((current) => {
      const idx = ingredientsAcc.findIndex(
        (ingredient) => ingredient.ingredientId === current.ingredientId
      );

      if (idx === -1) {
        ingredientsAcc.push(current);
      } else {
        ingredientsAcc[idx].amount =
          +current.amount + +ingredientsAcc[idx].amount;
      }
    });

    const productsingredients = await ingredientsRepo.findBy({
      id: In(ingredientsAcc.map(({ ingredientId }) => ingredientId)),
    });

    for (let i = 0; i < ingredientsAcc.length; i++) {
      const ingredientInfo = ingredientsAcc[i];

      const ingredient = productsingredients[i];

      for (let j = 0; j < ordersProducts.length; j++) {
        const orderProduct = ordersProducts[j];

        if (ingredient.amount < ingredientInfo.amount * orderProduct.quantity) {
          throw new AppError("Insufficient stock for this order", 400);
        }
      }
    }

    let isWarning = false;
    const lowStockIngredients: string[] = [];

    for (let i = 0; i < ingredientsAcc.length; i++) {
      const ingredientInfo = ingredientsAcc[i];

      const ingredient = productsingredients[i];

      for (let j = 0; j < ordersProducts.length; j++) {
        const orderProduct = ordersProducts[j];

        ingredient.amount =
          +ingredient.amount - ingredientInfo.amount * orderProduct.quantity;

        if (ingredient.amount <= +ingredient.amountMin) {
          isWarning = true;
          lowStockIngredients.push(ingredient.name);
        }
      }
    }

    ingredientsRepo.save(productsingredients);

    const orderTotalPrice = products.reduce(
      (acc, curr, idx) => acc + curr.price * ordersProducts[idx].quantity,
      0
    );

    bill.total = +bill.total + orderTotalPrice;

    await billsRepo.save(bill);

    const order = orderRepo.create({
      table,
      employeeId,
      billId,
      total: orderTotalPrice,
      status: "pending",
    });

    await orderRepo.save(order);

    ordersProducts.forEach(async ({ productId, quantity }, index) => {
      const orderProduct = orderProductRepo.create({
        orderId: order.id,
        productId,
        totalPrice: products[index].price * quantity,
        quantity,
      });

      await orderProductRepo.save(orderProduct);
    });

    return { isWarning, order, lowStockIngredients };
  }
}

export default CreateOrderService;
