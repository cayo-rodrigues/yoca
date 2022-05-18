import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from "typeorm";
import ProductFeedback from "./ProductFeedback.model";

import Category from "./Category.model";


@Entity("products")
export default class Product {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ length: 164, unique: true })
  name: string;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  price: number;

  @Column({ type: "decimal", precision: 11, scale: 2 })
  calories: number;

  @ManyToMany(() => Category, { eager: true })
  @JoinTable({
    name: "products_categories",
    joinColumn: { name: "product_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
  })
  categories: Category[];

  @OneToMany(() => ProductFeedback, (feedback) => feedback.product, {
    eager: true,
  })
  feedbacks: ProductFeedback[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => ProductFeedback, (feedback) => feedback, {
    eager: true
  })
  feedbacks: ProductFeedback[]
}
