import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @Column()
  amount: number;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  productId: string;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.productIngredients)
  ingredient: Ingredient;

  @Column()
  ingredientId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
