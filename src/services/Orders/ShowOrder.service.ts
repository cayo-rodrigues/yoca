import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IUUID } from "../../interfaces/IdParam.interface";
import Order from "../../models/Order.model";

class ShowOrderService {
  static async execute({ id }: IUUID): Promise<any> {
    const orderRepo = AppDataSource.getRepository(Order);

    const order = await orderRepo.findOne({ where: { id } });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return order;
  }
}

export default ShowOrderService;
