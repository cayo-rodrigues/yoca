import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import Order from "./Order.model";
import Product from "./Product.model";

@Entity("orders_products")
class OrderProduct {
  @Exclude()
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column()
  quantity: number;

  @Column()
  totalPrice: number;

  @Exclude()
  @Column()
  productId: string;

  @Exclude()
  @Column()
  orderId: string;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}

export default OrderProduct;
