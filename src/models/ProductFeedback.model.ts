import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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
}
