import { hash } from "bcryptjs";
import { instanceToInstance } from "class-transformer";
import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import Employee from "../../models/Employee.model";

interface CreateSuperServiceParams {
  phone: string;
  name: string;
  email: string;
  password: string;
}

class CreateSuperService {
  static async execute({
    phone,
    name,
    email,
    password,
  }: CreateSuperServiceParams): Promise<Employee> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const isSuperUserAlreadyCreated = await employeeRepository.findOne({
      where: { accessLevel: 1 },
    });

    if (isSuperUserAlreadyCreated) {
      throw new AppError("Super user has alredy been created", 409);
    }

    const superUser = employeeRepository.create({
      phone,
      name,
      email,
      password: await hash(password, 8),
      accessLevel: 1,
    });

    employeeRepository.save(superUser);

    const superUserWithoutPassword = instanceToInstance(superUser);

    return superUserWithoutPassword;
  }
}

export default CreateSuperService;
