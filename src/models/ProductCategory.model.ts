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

  @Column({ name: "product_id" })
  productId: string;

  @Column({ name: "category_id" })
  categoryId: string;

  @OneToMany(() => Category, (Category) => Category.id)
  category: Category;

  @OneToMany(() => Product, (Product) => Product.id)
  product: Product;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;
}
