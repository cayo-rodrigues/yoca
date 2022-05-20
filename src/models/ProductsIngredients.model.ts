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

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @Column({ name: "product_id" })
  productId: string;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.productIngredients, {
    eager: true,
  })
  ingredient: Ingredient;

  @Column({ name: "ingredient_id" })
  ingredientId: string;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;
}
