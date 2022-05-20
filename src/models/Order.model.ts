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
  DeleteDateColumn,
} from "typeorm";

import Employee from "./Employee.model";

import Bill from "./Bill.model";
import OrderProduct from "./OrdersProducts.model";

@Entity("orders")
export default class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  table: string;

  @Column()
  status: string;

  @Column()
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

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;

  // @AfterLoad()
  // getTotalPrice() {
  //   this.total = this.orderProducts.reduce(
  //     (acc, curr) => acc + curr.totalPrice,
  //     0
  //   );
  // }
}
