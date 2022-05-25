import { Exclude } from "class-transformer";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from "typeorm";

import Category from "./Category.model";
import Product from "./Product.model";

@Entity("products_categories")
export default class ProductCategory {
  @Exclude()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Exclude()
  @Column()
  productId: string;

  @Exclude()
  @Column()
  categoryId: string;

  @ManyToOne(() => Category, { eager: true })
  category: Category;

  @ManyToOne(() => Product)
  product: Product;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
