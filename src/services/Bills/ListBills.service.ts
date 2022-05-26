import AppDataSource from "../../data-source";
import { IListBills } from "../../interfaces/Bill.interface";
import Bill from "../../models/Bill.model";
import { getUrl } from "../../utils";

class ListBillsService {
  static async execute({
    listUnpaid,
    per_page,
    page,
  }: IListBills): Promise<any> {
    const billsRepository = AppDataSource.getRepository(Bill);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    const count = await billsRepository.count();

    const pages = Math.ceil(count / per_page);

    const prev =
      page <= 1
        ? null
        : `${getUrl()}/bills?per_page=${per_page}&page=${page - 1}`;

    const next =
      page >= pages
        ? null
        : `${getUrl()}/bills?per_page=${per_page}&page=${page + 1}`;

    const bills = await billsRepository.find({
      skip: per_page * (page - 1),
      take: per_page,
      [listUnpaid ? "where" : ""]: {
        paid: false,
      },
    });

    return {
      results: bills,
      info: {
        count,
        pages,
        next,
        prev,
      },
    };
  }
}

export default ListBillsService;
