interface ProductOrder {
  product_id: string;
  quantity: number;
}

export interface Order {
  id: string;
  table: string;
  products: ProductOrder[];
  status: string;
  total: number;
  bill_id: number;
  employee_id: string;
}


export interface OrderCreateReq {
    table: string
    products: ProductOrder[]
    bill_id: number
    employee_id: string
}