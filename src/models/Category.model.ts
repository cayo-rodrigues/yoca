import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import ProductCategory from "./ProductCategory.model";

@Entity("categories")
export default class Category {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @OneToMany(() => ProductCategory, (productCategory) => productCategory.category)
  products: ProductCategory[];

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
