import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import Product from "../../models/Product.model";

class ListProductsService {
  static async execute({ per_page, page }: IList): Promise<Product[]> {
    const productsRepo = AppDataSource.getRepository(Product);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    return await productsRepo.find({
      skip: per_page * (page - 1),
      take: per_page,
    });
  }
}

export default ListProductsService;
