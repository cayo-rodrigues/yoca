import {
  AfterLoad,
  Column,
  CreateDateColumn,
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

  @Column({ type: "int", default: 1 })
  quantity: number;

  @Column({ type: "decimal", precision: 8, scale: 2, name: "total_price" })
  totalPrice: number;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column()
  productId: string;

  @Column()
  orderId: string;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;

  @AfterLoad()
  getTotalPrice() {
    this.totalPrice = this.product.price * this.quantity;
  }
}

export default OrderProduct;
