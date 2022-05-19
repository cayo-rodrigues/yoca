import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  AfterLoad,
} from "typeorm";
import Employee from "./Employee.model";

import Bill from "./Bill.model";
import Product from "./Product.model";
import OrderProduct from "./OrdersProducts.model";

export enum OrderStatus {
  PENDING = "pending",
  READY = "ready",
  SERVED = "served",
}

@Entity("orders")
export default class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "table", type: "varchar", length: "3" })
  table: string;

  @Column({
    name: "status",
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ name: "total", type: "decimal", precision: 8, scale: 2 })
  total: number;

  @ManyToOne(() => Employee, (employee) => employee, {
    eager: true,
  })
  @JoinColumn({ name: "employee_id" })
  employee: Employee;

  @ManyToOne(() => Bill)
  bill_id: string;

  @ManyToOne(() => Bill, (bill) => bill)
  @JoinColumn({ name: "bill_id" })
  bill: Bill;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product, {
    eager: true,
  })
  orderProduct: OrderProduct[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @AfterLoad()
  getTotalPrice() {
    this.total = this.orderProduct.reduce(
      (acc, curr) => acc + curr.total_price,
      0
    );
  }
}
