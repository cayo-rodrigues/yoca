import { hash } from "bcryptjs";
import { instanceToInstance } from "class-transformer";
import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { ICreateSuper } from "../../interfaces/Super.interface";
import Employee from "../../models/Employee.model";

class CreateSuperService {
  static async execute({
    phone,
    name,
    email,
    password,
  }: ICreateSuper): Promise<Employee> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const users = await employeeRepository.find();

    if (users.length > 0) {
      throw new AppError(
        "Super user has to be created before other users",
        409
      );
    }

    const superUser = employeeRepository.create({
      phone,
      name,
      email,
      password: await hash(password, 8),
      accessLevel: 1,
    });

    await employeeRepository.save(superUser);

    const superUserWithoutPassword = instanceToInstance(superUser);

    return superUserWithoutPassword;
  }
}

export default CreateSuperService;
