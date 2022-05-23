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
