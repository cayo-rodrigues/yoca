import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("groups")
@Check('"access_level" BETWEEN 1 AND 5')
class Group {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ type: "int2", unique: true })
  access_level: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}

export default Group;
