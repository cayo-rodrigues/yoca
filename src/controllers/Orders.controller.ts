import { Request, Response } from "express";
import { ICreateOrder } from "../interfaces/Orders.interface";
import CreateOrderService from "../services/Orders/CreateOrder.service";
import ListOrdersService from "../services/Orders/ListOrders.service";

class OrdersController {
  static async store(req: Request, res: Response) {
    const orderInfo: ICreateOrder = req.body;

    const order = await CreateOrderService.execute(orderInfo);

    return res.status(201).send(order);
  }

  static async index(req: Request, res: Response) {
    const orders = await ListOrdersService.execute();
    return res.send(orders);
  }

  static async show(req: Request, res: Response) {}

  static async update(req: Request, res: Response) {}

  static async delete(req: Request, res: Response) {}
}

export default OrdersController;
