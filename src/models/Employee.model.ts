import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Exclude } from "class-transformer";

@Entity("employees")
@Check('"access_level" BETWEEN 1 AND 5')
class Employee {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ length: 164 })
  name: string;

  @Column({ length: 15, unique: true })
  phone: string;

  @Column({ length: 164, unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: "int2", name: "access_level" })
  accessLevel: number;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;
}

export default Employee;
