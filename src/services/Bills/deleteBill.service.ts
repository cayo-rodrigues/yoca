import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import Bill from "../../models/Bill.model";

interface DeleteBillServiceParams {
  id: number;
}

class DeleteBillService {
  static async execute({ id }: DeleteBillServiceParams): Promise<void> {
    const billsRepo = AppDataSource.getRepository(Bill);

    const bill = await billsRepo.findOneBy({ id });
    if (!bill) {
      throw new AppError("Bill not found", 404);
    }

    await billsRepo.softDelete({ id });
  }
}

export default DeleteBillService;
