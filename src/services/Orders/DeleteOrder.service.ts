import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import Order from "../../models/Order.model";

class DeleteOrderService {
  static async execute(id: string): Promise<any> {
    const orderRepo = AppDataSource.getRepository(Order);

    const order = await orderRepo.findOne({ where: { id } });

    if (!order) {
      throw new AppError("Order with this id not found", 404);
    }

    await orderRepo.softDelete(id);

    return;
  }
}

export default DeleteOrderService;