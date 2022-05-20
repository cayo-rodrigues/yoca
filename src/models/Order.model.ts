import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  AfterLoad,
} from "typeorm";

import Employee from "./Employee.model";

import Bill from "./Bill.model";
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

  @ManyToOne(() => Bill, (bill) => bill.orders)
  @JoinColumn({ name: "bill_id" })
  bill: Bill;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;

  @AfterLoad()
  getTotalPrice() {
    this.total = this.orderProducts.reduce(
      (acc, curr) => acc + curr.totalPrice,
      0
    );
  }
}
