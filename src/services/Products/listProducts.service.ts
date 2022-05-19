import AppDataSource from "../../data-source";
import Product from "../../models/Product.model";

class ListProductsService {
  static async execute(): Promise<Product[]> {
    const productsRepo = AppDataSource.getRepository(Product);

    const products = await productsRepo.find();

    return products;
  }
}

export default ListProductsService;
