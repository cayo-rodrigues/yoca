import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";

import {
  CreateEmployeeServiceParams,
  UpdateEmployeeData,
} from "../interfaces/Employee.interface";
import CreateEmployeeService from "../services/Employees/CreateEmployee.service";
import deleteEmployeeService from "../services/Employees/DeleteEmployee.service";
import ListAllEmployeesService from "../services/Employees/ListAllEmployees.service";
import showEmployeeService from "../services/Employees/ShowEmployee.service";
import updateEmployeeService from "../services/Employees/UpdateEmployee.service";

class EmployeesController {
  static async store(req: Request, res: Response) {
    const {
      accessLevel,
      email,
      name,
      password,
      phone,
    }: CreateEmployeeServiceParams = req.body;

    const employee = await CreateEmployeeService.execute({
      accessLevel,
      email,
      name,
      password,
      phone,
    });

    res.status(201).json({
      message: "Employee created",
      employee: instanceToPlain(employee),
    });
  }

  static async index(req: Request, res: Response) {
    const employees = await ListAllEmployeesService.execute();

    res.json(instanceToPlain(employees));
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const employee = await showEmployeeService.execute(id);

    res.json(instanceToPlain(employee));
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const loggedUser = req.user;
    const { accessLevel, email, name, password, phone }: UpdateEmployeeData =
      req.body;

    const employee = await updateEmployeeService.execute({
      id,
      loggedUser,
      updateData: {
        accessLevel,
        email,
        name,
        password,
        phone,
      },
    });

    res.json({
      message: "Employee updated",
      employee: instanceToPlain(employee),
    });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    await deleteEmployeeService.execute(id);

    res.status(204).json();
  }
}

export default EmployeesController;
