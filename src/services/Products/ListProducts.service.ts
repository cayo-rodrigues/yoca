import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import Product from "../../models/Product.model";
import { getUrl } from "../../utils";

class ListProductsService {
  static async execute({ per_page, page }: IList): Promise<any> {
    const productsRepo = AppDataSource.getRepository(Product);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    const count = await productsRepo.count();

    const pages = Math.ceil(count / per_page);

    const prev =
      page <= 1
        ? null
        : `${getUrl()}/products?per_page=${per_page}&page=${page - 1}`;

    const next =
      page >= pages
        ? null
        : `${getUrl()}/products?per_page=${per_page}&page=${page + 1}`;

    const products = await productsRepo.find({
      skip: per_page * (page - 1),
      take: per_page,
    });

    return {
      results: products,
      info: {
        count,
        pages,
        next,
        prev,
      },
    };
  }
}

export default ListProductsService;
