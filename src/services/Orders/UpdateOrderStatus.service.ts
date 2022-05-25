import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IUpdateStatusReq } from "../../interfaces/Orders.interface";
import Order from "../../models/Order.model";

class UpdateOrderStatusService {
  static async execute({ status, id }: IUpdateStatusReq): Promise<Order> {
    const ordersRepo = AppDataSource.getRepository(Order);

    const order = await ordersRepo.findOne({
      where: {
        id,
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    order.status = status;

    await ordersRepo.save(order);

    return order;
  }
}

export default UpdateOrderStatusService;
