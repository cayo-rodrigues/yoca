import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Exclude } from "class-transformer";
import Order from "./Order.model";

@Entity("employees")
@Check('"access_level" BETWEEN 1 AND 5')
class Employee {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ name: "access_level" })
  accessLevel: number;

  @OneToMany(() => Order, (Order) => Order.employeeId)
  orders: Order[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;
}

export default Employee;
