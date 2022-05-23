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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Bill;
