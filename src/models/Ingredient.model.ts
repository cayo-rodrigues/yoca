import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import ProductIngredient from "./ProductsIngredients.model";

@Entity("ingredients")
export default class Ingredient {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column()
  name: string;

  @Column()
  measure: string;

  @Column()
  amount: number;

  @Column()
  amountMin: number;

  @Column()
  amountMax: number;

  @OneToMany(
    () => ProductIngredient,
    (productIngredient) => productIngredient.ingredient
  )
  productIngredients: ProductIngredient[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
