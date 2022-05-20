import Category from "../models/Category.model";
import Ingredient from "../models/Ingredient.model";

export interface ICreateProduct {
  name: string;
  price: number;
  calories: number;
  ingredients: Ingredient[];
  categories: Category[];
}
