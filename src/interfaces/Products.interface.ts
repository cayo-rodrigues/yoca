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

export interface IUpdateProduct {
  id?: string;
  name?: string;
  price?: number;
  calories?: number;
  ingredients?: ICreateProductIngredients[];
  categories?: string[];
}
