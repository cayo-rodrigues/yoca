import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IBillUpdateReq } from "../../interfaces/Bill.interface";
import Bill from "../../models/Bill.model";

class UpdateBillService {
  static async execute({ paid, id }: IBillUpdateReq): Promise<Bill> {
    const billsRepository = AppDataSource.getRepository(Bill);

    const bill = await billsRepository.findOne({ where: { id } });

    if (!bill) {
      throw new AppError("Bill not found", 404);
    }

    bill.paid = paid;

    await billsRepository.update(bill.id, { paid });

    return bill;
  }
}

export default UpdateBillService;
