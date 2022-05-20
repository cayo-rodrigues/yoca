import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import Product from "./Product.model";

@Entity("categories")
export default class Category {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ length: 64, unique: true, name: "name" })
  name: string;

  @ManyToMany(() => Product)
  products: Product[];

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;
}
