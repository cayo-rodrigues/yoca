import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("general_feedbacks")
@Check('"rating" BETWEEN 1 AND 5')
export default class GeneralFeedback {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column()
  description: string;

  @Column()
  rating: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
