import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { OrderCreateReq } from "../../interfaces/Orders.interface";
import Bill from "../../models/Bill.model";
import Employee from "../../models/Employee.model";
import Order from "../../models/Order.model";
import OrderProduct from "../../models/OrdersProducts.model";
import Product from "../../models/Product.model";
import { In } from "typeorm";
class CreateOrderService {
  static async execute({
    table,
    products,
    bill_id,
    employee_id,
  }: OrderCreateReq): Promise<any> {
    const orderRepository = AppDataSource.getRepository(Order);
    const ordersProductsRepository = AppDataSource.getRepository(OrderProduct);
    const employeeRespository = AppDataSource.getRepository(Employee);
    const billRespository = AppDataSource.getRepository(Bill);
    const productsRepository = AppDataSource.getRepository(Product);
    const billFound = await billRespository.findOne({ where: { id: bill_id } });

    if (!billFound) {
      throw new AppError("Bill not found", 404);
    }

    const employeeFound = await employeeRespository.findOne({
      where: { id: employee_id },
    });

    if (!employeeFound) {
      throw new AppError("Employee not found", 404);
    }

    const createdOrder = orderRepository.create({
      table,
      employee: employeeFound,
      bill: billFound,
    });

    await orderRepository.save(createdOrder);

    products.forEach(async (product) => {
      const currentProduct = await productsRepository.findOne({
        where: { id: product.product_id },
      });

      if (!currentProduct) {
        throw new AppError("Product not found", 404);
      }

      const totalPrice = currentProduct.price * product.quantity;

      const orderProduct = ordersProductsRepository.create({
        productId: product.product_id,
        orderId: createdOrder.id,
        quantity: product.quantity,
        totalPrice,
      });

      await ordersProductsRepository.save(orderProduct);
    });

    return {
      message: "Order created",
      order: createdOrder,
    };
  }
}
export default CreateOrderService;
