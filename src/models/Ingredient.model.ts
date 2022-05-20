import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @Column({ name: "amount_min" })
  amountMin: number;

  @Column({ name: "amount_max" })
  amountMax: number;

  @OneToMany(
    () => ProductIngredient,
    (productIngredient) => productIngredient.ingredient
  )
  productIngredients: ProductIngredient[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;
}
