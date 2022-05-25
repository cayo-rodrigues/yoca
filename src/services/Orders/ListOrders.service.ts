import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import Order from "../../models/Order.model";

class ListOrdersService {
  static async execute({ page, per_page }: IList): Promise<any> {
    const ordersRepo = AppDataSource.getRepository(Order);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    const count = await ordersRepo.count();

    const pages = Math.ceil(count / per_page);

    const prev =
      page <= 1
        ? null
        : `urlDoHeroku/bills?per_page=${per_page}&page=${page - 1}`;

    const next =
      page >= pages
        ? null
        : `urlDoHeroku/bills?per_page=${per_page}&page=${page + 1}`;

    const orders = await ordersRepo.find({
      skip: per_page * (page - 1),
      take: per_page,
    });

    return {
      orders,
      info: {
        count,
        pages,
        next,
        prev,
      },
    };
  }
}

export default ListOrdersService;
