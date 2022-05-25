import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import Order from "../../models/Order.model";

class ListOrdersService {
  static async execute({ page, per_page }: IList): Promise<Order[]> {
    const ordersRepo = AppDataSource.getRepository(Order);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    return await ordersRepo.find({
      skip: per_page * (page - 1),
      take: per_page,
    });
  }
}

export default ListOrdersService;
