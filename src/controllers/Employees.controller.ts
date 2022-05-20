import { Request, Response } from "express";
import CreateEmployeeService from "../services/Employees/createEmployee.service";
import deleteEmployeeService from "../services/Employees/deleteEmployee.service";
import ListAllEmployeesService from "../services/Employees/ListAllEmployees.service";
import showEmployeeService from "../services/Employees/showEmployee.service";
import updateEmployeeService from "../services/Employees/updateEmployee.service";

export default class EmployeesController {
  static async store(req: Request, res: Response) {
    const data = req.body;

    const employee = await CreateEmployeeService.execute(data);

    res.status(201).json({
      message: "Employee created",
      employee,
    });
  }

  static async index(req: Request, res: Response) {
    const employees = await ListAllEmployeesService.execute();

    res.status(200).json(employees);
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const employee = await showEmployeeService.execute(id);

    res.status(200).json(employee);
  }

  static async update(req: Request, res: Response) {
    const updateData = req.body;
    const loggedUser = req.user;
    const { id } = req.params;

    const employee = await updateEmployeeService.execute({
      id,
      updateData,
      loggedUser,
    });

    res.status(200).json(employee);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    await deleteEmployeeService.execute(id);

    res.status(204).json();
  }
}
