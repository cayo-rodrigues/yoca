import { Not } from "typeorm";
import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IBaseIngredientFull } from "../../interfaces/Ingredient.interface";
import Ingredient from "../../models/Ingredient.model";

class UpdateIngredientService {
  static async execute({
    id,
    amount,
    amountMax,
    amountMin,
    measure,
    name,
  }: IBaseIngredientFull): Promise<Ingredient> {
    const ingredientRepo = AppDataSource.getRepository(Ingredient);

    const ingredientAlreadyExists = await ingredientRepo.findOne({
      where: { name, id: Not(id) },
    });

    if (ingredientAlreadyExists) {
      throw new AppError(
        "Ingredient already exists, add to its amount instead",
        409
      );
    }

    const updatedIngredient = await ingredientRepo
      .createQueryBuilder()
      .update(Ingredient, { amount, amountMax, amountMin, measure, name })
      .where("id = :id", { id })
      .returning("*")
      .execute()
      .then(({ raw }) => raw[0]);

    if (!updatedIngredient) {
      throw new AppError("Ingredient not found", 404);
    }

    return updatedIngredient;
  }
}

export default UpdateIngredientService;
