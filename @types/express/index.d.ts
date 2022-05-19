import * as express from "express";
import Employee from "../../src/models/Employee.model";

declare global {
  namespace Express {
    interface Request {
      user: Employee;
    }
  }
}
