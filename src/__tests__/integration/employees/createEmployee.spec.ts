import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

type EmployeeResponse = {
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

describe("POST - /employees", () => {
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

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to create an employee", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockEmployee);

    expect(createEmployeeResponse.status).toBe(201);
    expect(createEmployeeResponse.body).toMatchObject<EmployeeResponse>({
      message: "Employee created",
      employee: {
        ...createEmployeeResponse.body.employee,
        name: "john doe",
        email: "johndoe@email.com",
        phone: "999999999999",
        accessLevel: 2,
      },
    });
  });
  it("Should not be able to create an employee with repeated email", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockEmployee);

    expect(createEmployeeResponse.status).toBe(409);
    expect(createEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Employee with this email already exists",
      })
    );
  });
  it("Should not be able to create an employee with repeated phone number", async () => {
    const EmployeeWithRepeatedNumber = {
      name: "John doe",
      email: "johndoe2@email.com",
      phone: "999999999999",
      password: "S3nh@F0rt3",
      accessLevel: 2,
    };

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(EmployeeWithRepeatedNumber);

    expect(createEmployeeResponse.status).toBe(409);
    expect(createEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Employee with this phone already exists",
      })
    );
  });
  it("Should not be able to create an employee without sending accessLevel 1 or 2", async () => {
    const withoutAccessEmployee = {
      name: "Jane doe",
      email: "janedoe@email.com",
      phone: "12345678910",
      password: "S3nh@F0rt3",
      accessLevel: 3,
    };

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const withoutAccessEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(withoutAccessEmployee);

    const withoutAccessEmployeeLogin = await request(app)
      .post("/sessions")
      .send({
        email: "janedoe@email.com",
        password: "S3nh@F0rt3",
      });

    const newEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${withoutAccessEmployeeLogin.body.token}`)
      .send({
        name: "Johnny doe",
        email: "johnnydoe@email.com",
        phone: "1234567891011",
        password: "S3nh@F0rt3",
        accessLevel: 4,
      });

    expect(newEmployeeResponse.status).toBe(401);
    expect(newEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
});
