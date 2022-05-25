import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

type EmployeeUpdatesResponse = {
  message: string;
  employee: {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    accessLevel: number;
    createdAt: Date;
    updatedAt: Date;
  };
};

describe(" PATCH - /employees/:id ", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    await request(app).post("/super").send({
      name: "testaurant",
      email: "admin@email.com",
      phone: "+55061940028922",
      password: "S3nh@F0rt3",
    });
  });

  const mockEmployee = {
    name: "John doe",
    email: "johndoe@email.com",
    phone: "999999999999",
    password: "S3nh@F0rt3",
    accessLevel: 2,
  };
  const employeeUpdates = {
    name: "New John Doe",
    email: "newjohndoe@email.com",
    phone: "8922-4002123",
    password: "S3nh@F0rt3",
    accessLevel: 4,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update an existing employee", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockEmployee);

    const updateEmployeeResponse = await request(app)
      .patch(`/employees/${createEmployeeResponse.body.employee.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(employeeUpdates);

    expect(updateEmployeeResponse.status).toBe(200);
    expect(updateEmployeeResponse.body).toMatchObject<EmployeeUpdatesResponse>({
      message: "Employee updated",
      employee: {
        ...updateEmployeeResponse.body.employee,
        name: "new john doe",
        email: "newjohndoe@email.com",
        phone: "8922-4002123",
        accessLevel: 4,
      },
    });
  });
  it("Should not be able to update an existing employee with repeated email", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockEmployee);

    const updateEmployeeResponse = await request(app)
      .patch(`/employees/${createEmployeeResponse.body.employee.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(employeeUpdates);

    expect(updateEmployeeResponse.status).toBe(409);
    expect(updateEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Employee with this email already exists",
      })
    );
  });
  it("Should not be able to update an existing employee without sending accessLevel 1 or 2", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const withoutAccessUser = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoedoe@email.com",
        phone: "999999999998",
        password: "S3nh@F0rt3",
        accessLevel: 3,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoedoe@email.com",
      password: "S3nh@F0rt3",
    });

    const employeeUpdates = {
      name: "New John Doe",
      email: "newjohndoedoe@email.com",
      phone: "8922-4002456",
      password: "S3nh@F0rt3",
      accessLevel: 4,
    };
    const updateEmployeeResponse = await request(app)
      .patch(`/employees/${withoutAccessUser.body.employee.id}`)
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`)
      .send(employeeUpdates);

    expect(updateEmployeeResponse.status).toBe(401);
    expect(updateEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
});
