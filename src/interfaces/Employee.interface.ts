import Employee from "../models/Employee.model";

export interface CreateEmployeeServiceParams {
  phone: string;
  name: string;
  email: string;
  password: string;
  accessLevel: number;
}

export interface UpdateEmployeeServiceParams {
  id: string;
  loggedUser: Employee;
  updateData: UpdateEmployeeData;
}

export interface UpdateEmployeeData {
  phone?: string;
  name?: string;
  email?: string;
  password?: string;
  accessLevel?: number;
}
