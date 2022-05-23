import AppDataSource from "../../data-source";
import Order from "../../models/Order.model";

interface ListOrdersServiceParams {}

class ListOrdersService {
  static async execute(): Promise<Order[]> {
    const ordersRepo = AppDataSource.getRepository(Order);

    return await ordersRepo.find();
  }
}

export default ListOrdersService;
