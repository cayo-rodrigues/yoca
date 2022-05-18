import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('Categories')
export default class Categories{
    @PrimaryGeneratedColumn('uuid')
    readonly id: string

    @Column({length: 64, unique: true, name: 'name'})
    name: string

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date
}