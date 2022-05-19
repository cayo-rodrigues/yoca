import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import Employee from "../../models/Employee.model";
import { hash } from "bcryptjs";
import { instanceToInstance } from "class-transformer";

interface CreateEmployeeServiceParams {
  loggedInUser: Employee;
  data: {
    phone: string;
    name: string;
    email: string;
    password: string;
    accessLevel: number;
  };
}

class CreateEmployeeService {
  static async execute({
    loggedInUser,
    data,
  }: CreateEmployeeServiceParams): Promise<Employee> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    if (loggedInUser.accessLevel > 2) {
      throw new AppError("Unauthorized", 401);
    }

    const { phone, name, email, password, accessLevel } = data;

    const emailOrPhoneAlreadyExists = await employeeRepository.findOne({
      where: [{ phone }, { email }],
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

    console.log({ employee });
    console.log({ employeeWithoutPassword });

    return employeeWithoutPassword;
  }
}

export default CreateEmployeeService;
