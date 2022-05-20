import AppDataSource from "../../data-source";
import Employee from "../../models/Employee.model";
import { instanceToInstance } from "class-transformer";

class ListAllEmployeesService {
  static async execute(): Promise<Employee[]> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employees = await employeeRepository.find();

    const employeesWithoutPassword = employees.map((employee) =>
      instanceToInstance(employee)
    );

    return employeesWithoutPassword;
  }
}

export default ListAllEmployeesService;
