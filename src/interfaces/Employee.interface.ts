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
  updateData: {
    phone?: string;
    name?: string;
    email?: string;
    password?: string;
    accessLevel?: number;
  };
}
