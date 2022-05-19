import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

describe(" DELETE - /employees/:id ", () => {
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

  it("Should be able to delete an employee", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValue("some-uuid");

    const loginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const createEmployeeResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${loginResponse.body.token}`)
      .send(mockEmployee);

    const delEmployeeResponse = await request(app)
      .delete("/employees/some-uuid")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(delEmployeeResponse.status).toBe(204);
    expect(delEmployeeResponse.body).toHaveLength(0);
    expect((await request(app).delete("/employees/some-uuid")).status).toBe(
      404
    );
  });
  it("Should not be able to delete an employee without auth", async () => {
    const delEmployeeResponse = await request(app).delete(
      "/employees/some-uuid"
    );

    expect(delEmployeeResponse.status).toBe(401);
    expect(delEmployeeResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
  it("Should not be able to delete an employee without id", async () => {
    const loginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const delEmployeeResponse = await request(app)
      .delete("/employees")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(delEmployeeResponse.status).toBe(400);
    expect(delEmployeeResponse.body).toEqual(
      expect.objectContaining({ message: "Missing params id" })
    );
  });
  it("Should not be able to delete an employee with unexistent id", async () => {
    const loginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const delEmployeeResponse = await request(app)
      .delete("/employees/some-aleatory-uuid")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(delEmployeeResponse.status).toBe(404);
    expect(delEmployeeResponse.body).toEqual(
      expect.objectContaining({ message: "Employee not found" })
    );
  });
});
