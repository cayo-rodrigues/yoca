import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Order from "./Order.model";

@Entity("bills")
class Bill {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ type: "boolean", default: false })
  paid: boolean;

  @Column({
    name: "total",
    type: "decimal",
    precision: 8,
    scale: 2,
    default: 0.0,
  })
  total: number;

  @OneToMany(() => Order, (order) => order.bill)
  orders: Order[];

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;
}

export default Bill;
