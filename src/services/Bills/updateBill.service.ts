import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { BillUpdateReq } from "../../interfaces/Bills.interface";
import Bill from "../../models/Bill.model";

class UpdateBillService {
  static async execute({ paid, id }: BillUpdateReq): Promise<any> {
    const billsRepository = AppDataSource.getRepository(Bill);

    const bill = await billsRepository.findOne({ where: { id } });

    if (!bill) {
      throw new AppError("Bill not found", 404);
    }

    bill.paid = paid;

    await billsRepository.update(bill.id, { paid });

    return {
      message: "Bill updated",
      bill,
    };
  }
}

export default UpdateBillService;
