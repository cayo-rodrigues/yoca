import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { string } from "yup";
import Employee from "./Employee.model";

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
  total: Number;

  @ManyToOne(() => Employee, (employee) => employee, {
    eager: true,
  })
  @JoinColumn({ name: "employee_id" })
  employee: Employee;
}
