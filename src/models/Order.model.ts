import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  AfterLoad,
  DeleteDateColumn,
} from "typeorm";

import Employee from "./Employee.model";

import Bill from "./Bill.model";
import OrderProduct from "./OrdersProducts.model";
import { Exclude, Expose } from "class-transformer";
import { IOrderProducts } from "../interfaces/Orders.interface";

@Entity("orders")
export default class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  table: string;

  @Column()
  status: string;

  @Column()
  total: number;

  @Exclude()
  @Column()
  employeeId: string;

  @ManyToOne(() => Employee, { eager: true })
  employee: Employee;

  @Column()
  billId: number;

  @ManyToOne(() => Bill)
  bill: Bill;

  @Exclude()
  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    eager: true,
  })
  orderProducts: OrderProduct[];

  @Expose({ name: "products" })
  getProducts(): IOrderProducts[] {
    return this.orderProducts?.map(({ quantity, totalPrice, product }) => ({
      quantity,
      totalPrice,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        calories: product.calories,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        ingredients: product.ingredients,
        feedbacks: product.feedbacks,
        categories: product.categories,
      },
    }));
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
