import AppDataSource from "../../data-source";
import Employee from "../../models/Employee.model";
import { IList } from "../../interfaces/List.interface";
import { getUrl } from "../../utils";

class ListEmployeesService {
  static async execute({ per_page, page }: IList): Promise<any> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    const count = await employeeRepository.count();

    const pages = Math.ceil(count / per_page);

    const prev =
      page <= 1
        ? null
        : `${getUrl()}/employees?per_page=${per_page}&page=${page - 1}`;

    const next =
      page >= pages
        ? null
        : `${getUrl()}/employees?per_page=${per_page}&page=${page + 1}`;

    const employees = await employeeRepository.find({
      skip: per_page * (page - 1),
      take: per_page,
    });

    return {
      results: employees,
      info: {
        count,
        pages,
        next,
        prev,
      },
    };
  }
}

export default ListEmployeesService;
