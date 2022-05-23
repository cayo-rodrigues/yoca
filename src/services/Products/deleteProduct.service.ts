import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IParamsIdProduct } from "../../interfaces/Products.interface";
import Product from "../../models/Product.model";

class DeleteProductService {
  static async execute({ id }: IParamsIdProduct): Promise<void> {
    const productsRepo = AppDataSource.getRepository(Product);

    await productsRepo.delete(id);
  }
}

export default DeleteProductService;
