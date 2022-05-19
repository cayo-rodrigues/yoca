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
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ type: "boolean", default: false })
  paid: boolean;

  @Column({ name: "total", type: "decimal", precision: 8, scale: 2, default: 0.00 })
  total: number;

  @OneToMany(() => Order, (order) => order, {
    eager: true,
  })
  orders: Order[];

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;

  @AfterLoad()
  getTotalPrice() {
    this.total = this.orders.reduce((acc, curr) => acc + curr.total, 0);
  }
}

export default Bill;
