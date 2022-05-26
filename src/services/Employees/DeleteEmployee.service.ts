import AppDataSource from "../../data-source";
import Employee from "../../models/Employee.model";
import AppError from "../../errors/AppError";
import { IUUID } from "../../interfaces/IdParam.interface";

class DeleteEmployeeService {
  static async execute({ id }: IUUID): Promise<void> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new AppError("Employee with this id not found", 404);
    }

    if (employee.accessLevel === 1) {
      throw new AppError("Super user cannot be deleted", 405);
    }

    await employeeRepository.softDelete(id);
  }
}

export default DeleteEmployeeService;
