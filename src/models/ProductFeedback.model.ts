import { Exclude } from "class-transformer";
import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import Product from "./Product.model";

@Entity("product_feedbacks")
@Check('"rating" BETWEEN 1 AND 5')
export default class ProductFeedback {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column()
  description: string;

  @Column()
  rating: number;

  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.name)
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
