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

  @ManyToOne(() => Group, (group) => group.access_level)
  access_level: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}

export default Employee;
