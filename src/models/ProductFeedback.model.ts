import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { string } from "yup";
import Product from "./Product.model";

@Entity("product_feedbacks")
@Check('"rating" BETWEEN 1 AND 5')
export default class ProductFeedback {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ length: 512 })
  description: string;

  @Column({ type: "int2" })
  rating: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product)
  @JoinColumn({ name: "product_id" })
  product: Product;
}
