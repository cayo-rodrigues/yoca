export interface IBaseIngredient {
  name: string;
  measure: string;
  amount: number;
  amountMax: number;
  amountMin: number;
}

export interface IBaseIngredientFull extends IBaseIngredient {
  id: string;
}
