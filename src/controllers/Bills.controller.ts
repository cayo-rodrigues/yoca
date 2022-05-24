import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import CreateBillService from "../services/Bills/createBill.service";
import ListBillsService from "../services/Bills/listBills.service";
import ShowBillService from "../services/Bills/showBill.service";
import UpdateBillService from "../services/Bills/updateBill.service";

class BillsController {
  static async store(req: Request, res: Response) {
    const createdBill = await CreateBillService.execute();

    return res.status(201).json(instanceToPlain(createdBill));
  }

  static async index(req: Request, res: Response) {
    const listUnpaid = !!req.query.unpaid;

    const bills = await ListBillsService.execute({ listUnpaid });

    return res.status(200).json(instanceToPlain(bills));
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const bill = await ShowBillService.execute({ id: +id });

    return res.send(instanceToPlain(bill));
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { paid } = req.body;

    const updated = await UpdateBillService.execute({ paid, id: +id });

    return res.status(200).json(instanceToPlain(updated));
  }

  static async delete(req: Request, res: Response) {}
}

export default BillsController;
