import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe(" DELETE - /employees/:id ", () => {
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

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to delete an employee", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });
    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockEmployee);

    const delEmployeeResponse = await request(app)
      .delete(`/employees/${createEmployeeResponse.body.employee.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    // retornando com {}

    expect(delEmployeeResponse.status).toBe(204);
    expect(delEmployeeResponse.body).toHaveLength(0);
    expect(
      (
        await request(app)
          .delete(`/employees/${createEmployeeResponse.body.employee.id}`)
          .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      ).status
    ).toBe(404);
  });
  it("Should not be able to delete an employee without sending accessLevel 1 or 2", async () => {
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

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockEmployee);

   //soft delete impedindo query

    const delEmployeeResponse = await request(app)
      .delete(`/employees/${createEmployeeResponse.body.employee.id}`)
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(delEmployeeResponse.status).toBe(401);
    expect(delEmployeeResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
  it("Should not be able to delete an employee without id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    const delEmployeeResponse = await request(app)
      .delete("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delEmployeeResponse.status).toBe(400);
    expect(delEmployeeResponse.body).toEqual(
      expect.objectContaining({ message: "Missing params id" })
    );
  });
  it("Should not be able to delete an employee with unexistent id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    const delEmployeeResponse = await request(app)
      .delete("/employees/0f640a5f-e13c-4418-aa41-b773207935492")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delEmployeeResponse.status).toBe(404);
    expect(delEmployeeResponse.body).toEqual(
      expect.objectContaining({ message: "Employee not found" })
    );
  });
});
