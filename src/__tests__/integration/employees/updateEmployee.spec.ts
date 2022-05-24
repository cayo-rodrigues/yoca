import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
import { clearDB } from "../../connection";
jest.mock("uuid");

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
      password: "admin123",
    });
  });

  const mockEmployee = {
    name: "John doe",
    email: "johndoe@email.com",
    phone: "999999999999",
    password: "12345678",
    accessLevel: 2,
  };

  afterEach(async ()=>{
    await clearDB(connection);
  })

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update an existing employee", async () => {
    const employeeUpdates = {
      name: "New John Doe",
      email: "newjohndoe@email.com",
      phone: "8922-4002",
      password: "12345678",
      accessLevel: 4,
    };
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValue("uuid");

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockEmployee);

    const updateEmployeeResponse = await request(app)
      .patch("/employees/uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
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
          accessLevel: 4,
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
      accessLevel: 4,
    };

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    const updateEmployeeResponse = await request(app)
      .patch("/employees/uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(employeeUpdates);

    expect(updateEmployeeResponse.status).toBe(409);
    expect(updateEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Employee with this email/access level already exists",
      })
    );
  });
  it("Should not be able to update an existing employee with accessLevel 1", async () => {
    const employeeUpdates = {
      name: "New John Doe",
      email: "verynewjohndoe@email.com",
      phone: "8922-4002",
      password: "12345678",
      accessLevel: 1,
    };

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    const updateEmployeeResponse = await request(app)
      .patch("/employees/uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(employeeUpdates);

    expect(updateEmployeeResponse.status).toBe(409);
    expect(updateEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Employee with this email/access level already exists",
      })
    );
  });
  it("Should not be able to update an existing employee without sending accessLevel 1 or 2", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    const withoutAccessUser = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "999999999999",
        password: "12345678",
        accessLevel: 3,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "12345678",
    });

    const employeeUpdates = {
      name: "New John Doe",
      email: "newjohndoe@email.com",
      phone: "8922-4002",
      password: "12345678",
      accessLevel: 4,
    };
    const updateEmployeeResponse = await request(app)
      .patch("/employees/uuid")
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
