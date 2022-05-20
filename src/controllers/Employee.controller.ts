import { Request, Response } from "express";
import CreateEmployeeService from "../services/Employee/createEmployee.service";
import deleteEmployeeService from "../services/Employee/deleteEmployee.service";
import ListAllEmployeesService from "../services/Employee/ListAllEmployees.service";
import showEmployeeService from "../services/Employee/showEmployee.service";

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

  static async update(req: Request, res: Response) {}

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    await deleteEmployeeService.execute(id);

    res.status(204).json();
  }
}
