import * as express from "express";

import { ICreateIngredient } from "../../src/interfaces/Ingredient.interface";
import {
  ICreateProduct,
  IUpdateProduct,
} from "../../src/interfaces/Products.interface";
import Employee from "../../src/models/Employee.model";

declare global {
  namespace Express {
    interface Request {
      user: Employee;
      ingredientInfo: ICreateIngredient;
    }
  }
}
