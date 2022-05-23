import { Exclude } from "class-transformer";
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

  @Column()
  productId: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}

export default OrderProduct;
