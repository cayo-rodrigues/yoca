import { Exclude } from "class-transformer";
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Order from "./Order.model";

@Entity("bills")
class Bill {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

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

  @OneToMany(() => Order, (order) => order.bill, {
    eager: true,
  })
  orders: Order[];

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at" })
  deletedAt: Date;

  @AfterLoad()
  getTotalPrice() {
    this.total = this.orders.reduce((acc, curr) => acc + curr.total, 0);
  }
}

export default Bill;
