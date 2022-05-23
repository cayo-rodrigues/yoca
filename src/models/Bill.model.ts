import { Exclude } from "class-transformer";
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  // @OneToMany(() => Order, (order) => order.billId, {
  //   eager: true,
  // })
  // orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAd: Date;
}

export default Bill;
