import AppDataSource from "../../data-source";
import Order from "../../models/Order.model";

class ListOrdersService {
  static async execute(): Promise<Order[]> {
    const ordersRepo = AppDataSource.getRepository(Order);

    return await ordersRepo.find();
  }
}

export default ListOrdersService;
