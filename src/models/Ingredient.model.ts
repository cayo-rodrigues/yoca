import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";
import ProductIngredient from "./ProductsIngredients.model";

@Entity("ingredients")
export default class Ingredient {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ unique: true, length: 164 })
  name: string;

  @Column({ length: 3 })
  measure: string;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  amount: number;

  @Column({ type: "decimal", precision: 8, scale: 2, name: "amount_min" })
  amountMin: number;

  @Column({ type: "decimal", precision: 8, scale: 2, name: "amount_max" })
  amountMax: number;

  @OneToMany(
    () => ProductIngredient,
    (productIngredient) => productIngredient.ingredient
  )
  productIngredients: ProductIngredient[];

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at" })
  deletedAt: Date;
}
