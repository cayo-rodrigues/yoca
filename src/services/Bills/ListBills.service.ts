import AppDataSource from "../../data-source";
import { IListBills } from "../../interfaces/Bill.interface";
import Bill from "../../models/Bill.model";

class ListBillsService {
  static async execute({ listUnpaid }: IListBills): Promise<Bill[]> {
    const billsRepository = AppDataSource.getRepository(Bill);

    if (listUnpaid) {
      return await billsRepository.findBy({ paid: false });
    }

    return await billsRepository.find();
  }
}

export default ListBillsService;
