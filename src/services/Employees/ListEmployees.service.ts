import AppDataSource from "../../data-source";
import Employee from "../../models/Employee.model";
import { IList } from "../../interfaces/List.interface";

class ListEmployeesService {
  static async execute({ per_page, page }: IList): Promise<Employee[]> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    return await employeeRepository.find({
      skip: per_page * (page - 1),
      take: per_page,
    });
  }
}

export default ListEmployeesService;
