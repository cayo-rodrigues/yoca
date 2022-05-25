import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";

import { ICreateOrder } from "../interfaces/Orders.interface";
import CreateOrderService from "../services/Orders/CreateOrder.service";
import DeleteOrderService from "../services/Orders/DeleteOrder.service";
import ListOrdersService from "../services/Orders/ListOrders.service";
import UpdateOrderStatusService from "../services/Orders/UpdateOrderStatus.service";

class OrdersController {
  static async store(req: Request, res: Response) {
    const { billId, employeeId, ordersProducts, table }: ICreateOrder =
      req.body;

    const order = await CreateOrderService.execute({
      billId,
      employeeId,
      ordersProducts,
      table,
    });

    return res.status(201).json(order);
  }

  static async index(req: Request, res: Response) {
    const orders = await ListOrdersService.execute();

    return res.json(instanceToPlain(orders));
  }

  static async show(req: Request, res: Response) {
    // TODO
  }

  static async update(req: Request, res: Response) {
    const { status } = req.body;
    const { id } = req.params;

    const orderUpdated = await UpdateOrderStatusService.execute({ status, id });

    return res.status(201).json({
      message: "Order status updated",
      order: instanceToPlain(orderUpdated),
    });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    await DeleteOrderService.execute({ id });

    res.status(204).json();
  }
}

export default OrdersController;
