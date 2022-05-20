import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import Order from "./Order.model";

@Entity("bills")
class Bill {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  paid: boolean;

  @Column()
  total: number;

  @OneToMany(() => Order, (order) => order.billId, {
    eager: true,
  })
  orders: Order[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @AfterLoad()
  getTotalPrice() {
    this.total = this.orders.reduce((acc, curr) => acc + curr.total, 0);
  }
}

export default Bill;
