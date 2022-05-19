import { Request, Response } from "express";
import CreateEmployeeService from "../services/Employee/createEmployee.service";

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
}
