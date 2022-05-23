export interface ICreateProductIngredients {
  id: string;
  amount: number;
}

export interface IParamsIdProduct {
  id: string;
}

export interface ICreateProduct {
  name: string;
  price: number;
  calories: number;
  ingredients: ICreateProductIngredients[];
  categories: string[];
}

export interface IUpdateProduct extends ICreateProduct {
  id: string;
}
