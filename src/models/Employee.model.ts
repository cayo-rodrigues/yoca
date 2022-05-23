import { Exclude } from "class-transformer";
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

  @Column()
  accessLevel: number;

  // @OneToMany(() => Order, (Order) => Order.employeeId)
  // orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}

export default Employee;
