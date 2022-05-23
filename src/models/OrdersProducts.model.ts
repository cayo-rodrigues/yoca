import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import Order from "./Order.model";
import Product from "./Product.model";

@Entity("orders_products")
class OrderProduct {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column()
  quantity: number;

  @Column()
  totalPrice: number;

  @ManyToOne(() => Order, (order) => order.id)
  order: Order;

  @Column()
  orderId: string;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @Column()
  productId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

export default OrderProduct;
