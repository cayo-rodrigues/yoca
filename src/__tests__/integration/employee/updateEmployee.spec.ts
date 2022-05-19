import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

describe(" PATCH - /employees/:id ", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  const mockEmployee = {
    name: "John doe",
    email: "johndoe@email.com",
    phone: "4002-8922",
    password: "123456",
    access_level: 2,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update an existing employee", async () => {
    const employeeUpdates = {
      name: "New John Doe",
      email: "newjohndoe@email.com",
      phone: "8922-4002",
      password: "12345678",
      access_level: 4,
    };
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValue("uuid");

    const loginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${loginResponse.body.token}`)
      .send(mockEmployee);

    const updateEmployeeResponse = await request(app)
      .patch("/employees/uuid")
      .set("Authorization", `Bearer ${loginResponse.body.token}`)
      .send(employeeUpdates);

    expect(updateEmployeeResponse.status).toBe(200);
    expect(updateEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Employee updated",
        employee: {
          id: "uuid",
          name: "New John Doe",
          email: "newjohndoe@email.com",
          phone: "8922-4002",
          access_level: 4,
        },
      })
    );
  });
  it("Should not be able to update an existing employee with repeated email", async () => {
    const employeeUpdates = {
      name: "New John Doe",
      email: "admin@email.com",
      phone: "8922-4002",
      password: "12345678",
      access_level: 4,
    };

    const loginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const updateEmployeeResponse = await request(app)
      .patch("/employees/uuid")
      .set("Authorization", `Bearer ${loginResponse.body.token}`)
      .send(employeeUpdates);

    expect(updateEmployeeResponse.status).toBe(409);
    expect(updateEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Employee with this email/access level already exists",
      })
    );
  });
  it("Should not be able to update an existing employee with access_level 1", async () => {
    const employeeUpdates = {
      name: "New John Doe",
      email: "verynewjohndoe@email.com",
      phone: "8922-4002",
      password: "12345678",
      access_level: 1,
    };

    const loginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const updateEmployeeResponse = await request(app)
      .patch("/employees/uuid")
      .set("Authorization", `Bearer ${loginResponse.body.token}`)
      .send(employeeUpdates);

    expect(updateEmployeeResponse.status).toBe(409);
    expect(updateEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Employee with this email/access level already exists",
      })
    );
  });
  it("Should not be able to update an existing employee without auth", async () => {
    const employeeUpdates = {
      name: "New John Doe",
      email: "newjohndoe@email.com",
      phone: "8922-4002",
      password: "12345678",
      access_level: 4,
    };
    const updateEmployeeResponse = await request(app)
      .patch("/employees/uuid")
      .send(employeeUpdates);

    expect(updateEmployeeResponse.status).toBe(401);
    expect(updateEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
});
