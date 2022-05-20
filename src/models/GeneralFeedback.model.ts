import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("general_feedbacks")
@Check('"rating" BETWEEN 1 AND 5')
export default class GeneralFeedback {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ length: 512 })
  description: string;

  @Column({ type: "int2" })
  rating: number;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;
}
