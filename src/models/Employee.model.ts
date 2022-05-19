import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Group from "./Groups.model";
import Order from "./Order.model";

@Entity("employees")
class Employee {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ length: 164 })
  name: string;

  @Column({ length: 15, unique: true })
  phone: string;

  @Column({ length: 164, unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Group, (group) => group.accessLevel)
  group: number;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;
}

export default Employee;
