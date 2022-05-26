import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import Product from "../../models/Product.model";
import { IParamsIdProduct } from "../../interfaces/Products.interface";

class DeleteProductService {
  static async execute({ id }: IParamsIdProduct): Promise<void> {
    const productsRepo = AppDataSource.getRepository(Product);

    const product = await productsRepo.findOne({ where: { id } });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    await productsRepo.delete(id);
  }
}

export default DeleteProductService;
