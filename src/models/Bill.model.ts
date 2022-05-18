import {
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

  @Column({ type: "boolean" })
  paid: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @OneToMany(() => Order, (order) => order, {
    eager: true,
  })
  orders: Order[];
}

export default Bill;
