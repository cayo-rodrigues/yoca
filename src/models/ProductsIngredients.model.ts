import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import Ingredient from "./Ingredient.model";
import Product from "./Product.model";

@Entity("products_ingredients")
export default class ProductIngredient {
  @Exclude()
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column()
  amount: number;

  @Exclude()
  @Column()
  productId: string;

  @Exclude()
  @Column()
  ingredientId: string;

  @ManyToOne(() => Ingredient, { eager: true })
  ingredient: Ingredient;

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
