import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

describe("POST - /employees", () => {
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

  it("Should be able to create an employee", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValue("uuid");

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockEmployee);

    expect(createEmployeeResponse.status).toBe(201);
    expect(createEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Employee created",
        employee: {
          id: "uuid",
          name: "John doe",
          email: "johndoe@email.com",
          phone: "4002-8922",
          access_level: 2,
        },
      })
    );
  });
  it("Should not be able to create an employee with repeated email", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockEmployee);

    expect(createEmployeeResponse.status).toBe(409);
    expect(createEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Employee with this email/access level already exists",
      })
    );
  });
  it("Should not be able to create an employee with access_level 1", async () => {
    const mockSuperEmployee = {
      name: "John doe",
      email: "newadmin@email.com",
      phone: "4002-8922",
      password: "123456",
      access_level: 1,
    };

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockSuperEmployee);

    expect(createEmployeeResponse.status).toBe(409);
    expect(createEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Employee with this email/access level already exists",
      })
    );
  });
  it("Should not be able to create an employee without sending access_level 1 or 2", async () => {
    const withoutAccessEmployee = {
      name: "Jane doe",
      email: "janedoe@email.com",
      phone: "4002-8922",
      password: "123456",
      access_level: 3,
    };

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const withoutAccessEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(withoutAccessEmployee);

    const withoutAccessEmployeeLogin = await request(app)
      .post("/sessions")
      .send({
        email: "janedoe@email.com",
        password: "123456",
      });

    const newEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${withoutAccessEmployeeLogin.body.token}`)
      .send({
        name: "Johnny doe",
        email: "johnnydoe@email.com",
        phone: "4002-8922",
        password: "123456",
        access_level: 4,
      });

    expect(newEmployeeResponse.status).toBe(401);
    expect(newEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
});
