import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("bills")
class Bill {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ type: "boolean" })
  paid: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}

export default Bill;
