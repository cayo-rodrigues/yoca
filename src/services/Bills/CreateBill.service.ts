import AppDataSource from "../../data-source";
import Bill from "../../models/Bill.model";

class CreateBillService {
  static async execute(): Promise<Bill> {
    const billsRepository = AppDataSource.getRepository(Bill);

    const createdBill = billsRepository.create();

    await billsRepository.save(createdBill);

    return createdBill;
  }
}

export default CreateBillService;
