import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import Employee from "../../models/Employee.model";
import { IUpdateEmployee } from "../../interfaces/Employee.interface";
import { hash } from "bcryptjs";
import { plainToInstance } from "class-transformer";
import { Not } from "typeorm";

class UpdateEmployeeService {
  static async execute({
    id,
    updateData,
    loggedUser,
  }: IUpdateEmployee): Promise<Employee> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new AppError("Employee with this id not found", 404);
    }

    if (employee.accessLevel === 1 && loggedUser.accessLevel !== 1) {
      throw new AppError("You need access level 1 to update super user", 401);
    }

    const { phone, email } = updateData;

    const emailOrPhoneAlreadyExists = await employeeRepository.findOne({
      where: [
        { phone, id: Not(id) },
        { email, id: Not(id) },
      ],
      withDeleted: true,
    });

    if (emailOrPhoneAlreadyExists) {
      if (emailOrPhoneAlreadyExists.email === email) {
        throw new AppError("Employee with this email already exists", 409);
      }
      if (emailOrPhoneAlreadyExists.phone === phone) {
        throw new AppError("Employee with this phone already exists", 409);
      }
    }

    employee.name = updateData.name ? updateData.name : employee.name;
    employee.email = updateData.email ? updateData.email : employee.email;
    employee.phone = updateData.phone ? updateData.phone : employee.phone;

    if (updateData.password) {
      employee.password = await hash(updateData.password, 8);
    }

    const updatedEmployee = await employeeRepository.save(employee);

    const employeeWithoutPassword = plainToInstance(Employee, updatedEmployee);

    return employeeWithoutPassword;
  }
}

export default UpdateEmployeeService;
