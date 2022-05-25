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

  it("Should be able to delete an employee", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockEmployee);

    const delEmployeeResponse = await request(app)
      .delete(`/employees/${createEmployeeResponse.body.employee.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delEmployeeResponse.status).toBe(204);
    expect(delEmployeeResponse.body).toEqual({});
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
      password: "S3nh@F0rt3",
    });

    const withoutAccessUser = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe1@email.com",
        phone: "999999999998",
        password: "S3nh@F0rt3",
        accessLevel: 3,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe1@email.com",
      password: "S3nh@F0rt3",
    });

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe5@email.com",
        phone: "999999995999",
        password: "S3nh@F0rt3",
        accessLevel: 2,
      });

    const delEmployeeResponse = await request(app)
      .delete(`/employees/${createEmployeeResponse.body.employee.id}`)
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(delEmployeeResponse.status).toBe(401);
    expect(delEmployeeResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
  it("Should not be able to delete an employee with an invalid id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const delEmployeeResponse = await request(app)
      .delete("/employees/invalidId")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delEmployeeResponse.status).toBe(400);
    expect(delEmployeeResponse.body).toEqual(
      expect.objectContaining({ message: "ID parameter must be an UUID" })
    );
  });
  it("Should not be able to delete an employee with unexistent id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const delEmployeeResponse = await request(app)
      .delete("/employees/a8eb95c5-c2e5-4036-bc8f-e1b18d2b89f1")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delEmployeeResponse.status).toBe(404);
    expect(delEmployeeResponse.body).toEqual(
      expect.objectContaining({ message: "Employee with this id not found" })
    );
  });
});
