import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IUUID } from "../../interfaces/IdParam.interface";
import Order from "../../models/Order.model";

class DeleteOrderService {
  static async execute({ id }: IUUID): Promise<void> {
    const orderRepo = AppDataSource.getRepository(Order);

    const order = await orderRepo.findOne({ where: { id } });

    if (!order) {
      throw new AppError("Order with this id not found", 404);
    }

    await orderRepo.softDelete(id);
  }
}

export default DeleteOrderService;
