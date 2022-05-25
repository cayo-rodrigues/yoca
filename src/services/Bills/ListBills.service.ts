import AppDataSource from "../../data-source";
import { IListBills } from "../../interfaces/Bill.interface";
import Bill from "../../models/Bill.model";

class ListBillsService {
  static async execute({
    listUnpaid,
    per_page,
    page,
  }: IListBills): Promise<Bill[]> {
    const billsRepository = AppDataSource.getRepository(Bill);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    if (listUnpaid) {
      return await billsRepository.find({
        skip: per_page * (page - 1),
        take: per_page,
        where: {
          paid: false,
        },
      });
    }

    return await billsRepository.find({
      skip: per_page * (page - 1),
      take: per_page,
    });
  }
}

export default ListBillsService;
