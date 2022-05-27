import { In, MoreThan } from "typeorm";
import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import Ingredient from "../../models/Ingredient.model";
import Product from "../../models/Product.model";
import { getUrl } from "../../utils";

const listAvailablesProductsService = async ({ per_page, page }: IList) => {
  const productsRepo = AppDataSource.getRepository(Product);
  const ingredientsRepo = AppDataSource.getRepository(Ingredient);

  if (!per_page) {
    per_page = 20;
  }

  if (!page) {
    page = 1;
  }

  const allProducts = await productsRepo.find();

  const allIngredientsInProducts = allProducts.map(
    ({ ingredients, id: productId }) => ({
      productId,
      ingredients: ingredients.map(({ ingredientId, amount }) => ({
        ingredientId,
        amount,
      })),
    })
  );

  const allIngredientsAvailable = await ingredientsRepo.find({
    where: {
      amount: MoreThan(0),
    },
    select: ["id", "amount"],
  });

  const idsProductsAvailable: string[] = [];
  let unavailable = false;

  for (let i = 0; i < allIngredientsInProducts.length; i++) {
    const { productId, ingredients } = allIngredientsInProducts[i];

    for (let j = 0; j < ingredients.length; j++) {
      const { ingredientId, amount } = ingredients[j];

      const ingredientAvailable = allIngredientsAvailable.find(
        ({ id }) => id === ingredientId
      );

      if (ingredientAvailable) {
        const doubleCheck = ingredients.filter(
          ({ amount, ingredientId: id }) =>
            ingredientAvailable.amount >= amount && ingredientId === id
        ).length;

        if (!(ingredientAvailable.amount >= amount && doubleCheck)) {
          unavailable = true;
          continue;
        } else {
          unavailable = false;
        }
      }
    }
    if (!unavailable) {
      idsProductsAvailable.push(productId);
    }
  }

  const availableProducts = await productsRepo.findBy({
    id: In(idsProductsAvailable),
  });

  const count = availableProducts.length;

  const pages = Math.ceil(count / per_page);

  const prev =
    page <= 1
      ? null
      : `${getUrl()}/products?per_page=${per_page}&page=${page - 1}`;

  const next =
    page >= pages
      ? null
      : `${getUrl()}/products?per_page=${per_page}&${page + 1}`;

  const paginatedAvailableProducts = availableProducts.slice(
    (page - 1) * per_page,
    page * per_page
  );

  return {
    results: paginatedAvailableProducts,
    info: {
      count,
      pages,
      next,
      prev,
    },
  };
};

export default listAvailablesProductsService;
