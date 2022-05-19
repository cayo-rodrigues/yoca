import AppDataSource from "../../data-source"
import Bill from "../../models/Bill.model"

class ListBillsService {
  static async execute(): Promise<Bill[]> {
      const billsRepository = AppDataSource.getRepository(Bill)

      const bills = billsRepository.find()

      return bills
  }
}

export default ListBillsService