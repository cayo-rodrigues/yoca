import AppDataSource from "../../data-source";
import Ingredient from "../../models/Ingredient.model";
import Product from "../../models/Product.model";

const listAvailablesProductsService = async () => {
  const productsRepo = AppDataSource.getRepository(Product);
  const ingredientsRepo = AppDataSource.getRepository(Ingredient);

  const allProducts = await productsRepo.find();

  // const allIngredientsIdsInProducts = allProducts
  //   .map((product) => product.ingredients.map((ingredient) => ingredient.id))
  //   .flat();

  const allIngredients = await ingredientsRepo.find();

  const ingredientsAvailable = allIngredients.filter(
    (ingredient) => ingredient.amount > 0
  );

  // const allIngredientsIdsAndAmounts = allProducts
  //   .map(({ ingredients }) =>
  //     ingredients.map(({ id, amount }) => ({ id, amount }))
  //   )
  //   .flat()
  //   .filter((el) => {
  //     if (ingredientsAvailable.map(({ id }) => id).includes(el.id)) {
  //       return el.amount >
  //     }
  //   });

  // console.log(allIngredientsIdsAndAmounts);
  return "ooi '";
};

export default listAvailablesProductsService;
