import AppDataSource from "../../data-source";
import Employee from "../../models/Employee.model";
import { instanceToInstance } from "class-transformer";
import AppError from "../../errors/AppError";

class showEmployeeService {
  static async execute(id: string): Promise<Employee> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new AppError("Employee with this id not found", 404);
    }

    const employeeWithoutPassword = instanceToInstance(employee);

    return employeeWithoutPassword;
  }
}

export default showEmployeeService;
