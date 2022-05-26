import Employee from "../models/Employee.model";

export interface ICreateEmployee {
  phone: string;
  name: string;
  email: string;
  password: string;
  accessLevel: number;
}

export interface IUpdateEmployee {
  id: string;
  loggedUser: Employee;
  updateData: IUpdateEmployeeData;
}

export interface IUpdateEmployeeData {
  phone?: string;
  name?: string;
  email?: string;
  password?: string;
  accessLevel?: number;
}
