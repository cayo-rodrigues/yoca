import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import Employee from "../../models/Employee.model";
import { hash } from "bcryptjs";
import { instanceToInstance } from "class-transformer";
import { ICreateEmployee } from "../../interfaces/Employee.interface";

class CreateEmployeeService {
  static async execute(data: ICreateEmployee): Promise<Employee> {
    const { phone, name, email, password, accessLevel } = data;

    const employeeRepository = AppDataSource.getRepository(Employee);

    const emailOrPhoneAlreadyExists = await employeeRepository.findOne({
      where: [{ phone }, { email }],
      withDeleted: true,
    });

    if (emailOrPhoneAlreadyExists?.email === email) {
      throw new AppError("Employee with this email already exists", 409);
    }
    if (emailOrPhoneAlreadyExists?.phone === phone) {
      throw new AppError("Employee with this phone already exists", 409);
    }

    const employee = employeeRepository.create({
      phone,
      name,
      email,
      password: await hash(password, 8),
      accessLevel,
    });

    await employeeRepository.save(employee);

    const employeeWithoutPassword = instanceToInstance(employee);

    return employeeWithoutPassword;
  }
}

export default CreateEmployeeService;
