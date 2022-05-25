import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import ProductFeedback from "./ProductFeedback.model";
import ProductIngredient from "./ProductsIngredients.model";
import ProductCategory from "./ProductCategory.model";

@Entity("products")
export default class Product {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  calories: number;

  @OneToMany(
    () => ProductIngredient,
    (ProductIngredient) => ProductIngredient.product,
    { eager: true }
  )
  ingredients: ProductIngredient[];

  @OneToMany(
    () => ProductCategory,
    (ProductCategory) => ProductCategory.product,
    { eager: true }
  )
  categories: ProductCategory[];

  @OneToMany(() => ProductFeedback, (feedback) => feedback.product, {
    eager: true,
  })
  feedbacks: ProductFeedback[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
