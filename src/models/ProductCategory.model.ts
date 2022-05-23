import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import Category from "./Category.model";
import Product from "./Product.model";

@Entity("products_categories")
export default class ProductCategory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  productId: string;

  @Column()
  categoryId: string;

  @OneToMany(() => Category, (Category) => Category.id)
  category: Category;

  @OneToMany(() => Product, (Product) => Product.id)
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
