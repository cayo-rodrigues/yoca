import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import Ingredient from "./Ingredient.model";
import Product from "./Product.model";

@Entity("products_ingredients")
export default class ProductIngredient {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  amount: number;

  @ManyToOne(() => Product, (product) => product.productIngredients)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.productIngredients, {
    eager: true,
  })
  @JoinColumn({ name: "ingredient_id" })
  ingredient: Ingredient;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;
}
