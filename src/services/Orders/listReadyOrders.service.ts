import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import Order from "../../models/Order.model";
import { getUrl } from "../../utils";

class ListReadyOrdersService {
  static async execute({ page, per_page }: IList): Promise<any> {
    const ordersRepo = AppDataSource.getRepository(Order);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    const count = await ordersRepo.count({
      where: {
        status: "ready",
      },
    });

    const pages = Math.ceil(count / per_page);

    const prev =
      page <= 1
        ? null
        : `${getUrl()}/orders?per_page=${per_page}&page=${page - 1}`;

    const next =
      page >= pages
        ? null
        : `${getUrl()}/orders?per_page=${per_page}&page=${page + 1}`;

    const orders = await ordersRepo.find({
      skip: per_page * (page - 1),
      take: per_page,
      where: {
        status: "ready",
      },
    });

    return {
      results: orders,
      info: {
        count,
        pages,
        next,
        prev,
      },
    };
  }
}

export default ListReadyOrdersService;
