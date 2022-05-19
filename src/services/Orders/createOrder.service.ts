import AppDataSource from "../../data-source";
import { OrderCreateReq } from "../../interfaces/Orders.interface";
import Order from "../../models/Order.model";

class CreateOrderService {
  static async execute(orderInfo: OrderCreateReq): Promise<any> {
    const orderRepository = AppDataSource.getRepository(Order);

    const createdOrder = await orderRepository.create(orderInfo);

    await orderRepository.save(createdOrder);

    return {
      message: "Order created",
      order: createdOrder,
    };
  }
}

export default CreateOrderService;
