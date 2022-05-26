import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import AppError from "../errors/AppError";

import CreateBillService from "../services/Bills/CreateBill.service";
import DeleteBillService from "../services/Bills/DeleteBill.service";
import ListBillsService from "../services/Bills/ListBills.service";
import ShowBillService from "../services/Bills/ShowBill.service";
import UpdateBillService from "../services/Bills/UpdateBill.service";

class BillsController {
  static async store(req: Request, res: Response) {
    const createdBill = await CreateBillService.execute();

    return res
      .status(201)
      .json({ message: "Bill created", bill: instanceToPlain(createdBill) });
  }

  static async index(req: Request, res: Response) {
    const listUnpaid = !!req.query.unpaid;
    const per_page = req.query.per_page as string;
    const page = req.query.page as string;

    const bills = await ListBillsService.execute({
      listUnpaid,
      per_page: +per_page,
      page: +page,
    });

    return res.json(instanceToPlain(bills));
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const bill = await ShowBillService.execute({ id: +id });

    return res.json(instanceToPlain(bill));
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { paid } = req.body;

    const updatedBill = await UpdateBillService.execute({ paid, id: +id });

    return res.json({
      message: "Bill updated",
      bill: instanceToPlain(updatedBill),
    });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    await DeleteBillService.execute({ id: +id });

    return res.status(204).json();
  }
}

export default BillsController;
