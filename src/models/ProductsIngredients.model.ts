import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Ingredient from "./Ingredient.model";
import Product from "./Product.model";

@Entity("products_ingredients")
export default class ProductIngredient {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  amount: number;

  @ManyToOne(() => Product, (product) => product.productIngredient)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.productIngredient, {
    eager: true,
  })
  @JoinColumn({ name: "ingredient_id" })
  ingredient: Ingredient;
}
