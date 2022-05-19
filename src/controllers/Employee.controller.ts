import { Request, Response } from "express";
import CreateEmployeeService from "../services/Employee/createEmployee.service";
import ListAllEmployeesService from "../services/Employee/ListAllEmployees.service";

export default class EmployeesController {
  static async store(req: Request, res: Response) {
    const data = req.body;
    const loggedInUser = req.user;

    const employee = await CreateEmployeeService.execute({
      loggedInUser,
      data,
    });

    res.status(201).json({
      message: "Employee created",
      employee,
    });
  }

  static async index(req: Request, res: Response) {
    const employees = await ListAllEmployeesService.execute();

    res.status(201).json(employees);
  }

  static async show(req: Request, res: Response) {}

  static async update(req: Request, res: Response) {}

  static async delete(req: Request, res: Response) {}
}
