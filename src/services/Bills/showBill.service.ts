import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import Bill from "../../models/Bill.model";

interface ShowBillServiceParams {
  id: number;
}

class ShowBillService {
  static async execute({ id }: ShowBillServiceParams): Promise<Bill> {
    const billsRepo = AppDataSource.getRepository(Bill);

    const bill = await billsRepo.findOneBy({ id });
    if (!bill) {
      throw new AppError("Bill not found", 404);
    }

    return bill;
  }
}

export default ShowBillService;
