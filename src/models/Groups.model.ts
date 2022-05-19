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

  @Column({ type: "int2", unique: true, name: "access_level" })
  accessLevel: number;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;
}

export default Group;
