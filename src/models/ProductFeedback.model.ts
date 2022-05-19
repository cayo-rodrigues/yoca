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

  @ManyToOne(() => Product, (product) => product.feedbacks)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;
}
