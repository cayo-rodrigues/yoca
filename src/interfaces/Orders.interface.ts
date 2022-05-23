import Product from "../models/Product.model";

export interface IOrderProduct {
  quantity: number;
  productId: string;
}

export interface ICreateOrder {
  ordersProducts: IOrderProduct[];
  table: string;
  employeeId: string;
  billId: number;
}

export interface IOrderProducts {
  quantity: number;
  totalPrice: number;
  product: Product;
}
