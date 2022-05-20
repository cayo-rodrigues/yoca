import { Request, Response } from "express";
import AppDataSource from "../data-source";
import Order from "../models/Order.model";
import CreateOrderService from "../services/Orders/createOrder.service";

class OrdersController {
  static async store(req: Request, res: Response) {
    const createdOrder = await CreateOrderService.execute(req.body);

    return res.status(201).json(createdOrder);
  }

  static async index(req: Request, res: Response) {
    const orders = await AppDataSource.getRepository(Order).find({
      relations: { orderProducts: true },
    });

    res.status(200).json(orders);
  }

  static async show(req: Request, res: Response) {}

  static async update(req: Request, res: Response) {}

  static async delete(req: Request, res: Response) {}

  static async userOrders(req: Request, res: Response) {}

  static async pendingOrders(req: Request, res: Response) {}

  static async readyOrders(req: Request, res: Response) {}
}

export default OrdersController;
