import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";

import {
  ICreateEmployee,
  IUpdateEmployeeData,
} from "../interfaces/Employee.interface";
import CreateEmployeeService from "../services/Employees/CreateEmployee.service";
import DeleteEmployeeService from "../services/Employees/DeleteEmployee.service";
import ListEmployeesService from "../services/Employees/ListEmployees.service";
import ShowEmployeeService from "../services/Employees/ShowEmployee.service";
import UpdateEmployeeService from "../services/Employees/UpdateEmployee.service";

class EmployeesController {
  static async store(req: Request, res: Response) {
    const { accessLevel, email, name, password, phone }: ICreateEmployee =
      req.body;

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
    const per_page = req.query.per_page as string;
    const page = req.query.page as string;

    const employees = await ListEmployeesService.execute({
      per_page: +per_page,
      page: +page,
    });

    res.json(instanceToPlain(employees));
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const employee = await ShowEmployeeService.execute({ id });

    res.json(instanceToPlain(employee));
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const loggedUser = req.user;
    const { accessLevel, email, name, password, phone }: IUpdateEmployeeData =
      req.body;

    const employee = await UpdateEmployeeService.execute({
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

    await DeleteEmployeeService.execute({ id });

    res.status(204).json();
  }
}

export default EmployeesController;
