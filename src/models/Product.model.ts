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
import ProductIngredient from "./ProductsIngredients.model";
import OrderProduct from "./OrdersProducts.model";
import { Exclude, Expose } from "class-transformer";
import Ingredient from "./Ingredient.model";

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
  productIngredients: ProductIngredient[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
