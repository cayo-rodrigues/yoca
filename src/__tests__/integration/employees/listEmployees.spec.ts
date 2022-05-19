import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe(" GET - /employees ", () => {
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
      password: "admin",
    });
  });

  const mockEmployee = {
    name: "John doe",
    email: "johndoe@email.com",
    phone: "99999999999",
    password: "123456",
    accessLevel: 2,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to list all employees", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockEmployee);
    const listEmployeesResponse = await request(app).get("/employees");

    expect(listEmployeesResponse.status).toBe(200);
    expect(listEmployeesResponse.body).toHaveProperty("reduce");
    expect(listEmployeesResponse.body).toEqual(
      expect.arrayContaining([createEmployeeResponse.body])
    );
  });

  it("Should not be able to list employees being unregistered user", async () => {
    const listEmployeesResponse = await request(app)
      .get("/employees")
      .set("Authorization", `Bearer someAleatoryToken`);

    expect(listEmployeesResponse.status).toBe(401);
    expect(listEmployeesResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
});
