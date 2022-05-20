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

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
