import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Bill from "./Bill.model";

export enum OrderStatus {
  PENDING = "pending",
  READY = "ready",
  SERVED = "served",
}

@Entity("Order")
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
  total: Number;

  @ManyToOne(() => Bill)
  bill_id: Bill;
}
