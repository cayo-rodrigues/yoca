import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}

export default Employee;
