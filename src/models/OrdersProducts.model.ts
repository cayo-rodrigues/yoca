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

  @Column({ name: "total_price" })
  totalPrice: number;

  @ManyToOne(() => Order, (order) => order.id)
  order: Order;

  @Column({ name: "order_id" })
  orderId: string;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column({ name: "product_id" })
  productId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;
}

export default OrderProduct;
