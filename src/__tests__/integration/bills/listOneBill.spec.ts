import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

describe(" GET - /bills/:id ", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to list one bill", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValueOnce("super-uuid");

    await request(app).post("/super").send({
      name: "testaurant",
      email: "admin@email.com",
      phone: "+55061940028922",
      password: "admin123",
    });

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    uuidSpy.mockReturnValueOnce("uuid");

    const waiterResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Johnny doe",
        email: "johnnydoe@email.com",
        phone: "1234567891011",
        password: "12345678",
        accessLevel: 3,
      });

    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johnnydoe@email.com",
      password: "12345678",
    });
    uuidSpy.mockReturnValueOnce("uuid");

    const billResponse = await request(app)
      .post("/bills")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`);

    const listOneBillResponse = await request(app)
      .get("/bills/uuid")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`);

    expect(listOneBillResponse.status).toBe(200);
    expect(listOneBillResponse.body).toHaveProperty("reduce");
    expect(listOneBillResponse.body).toEqual(
      expect.objectContaining({ ...billResponse.body.bill })
    );
  });

  it("Should not be able to list one bill with accessLevel greater than 4", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    uuidSpy.mockReturnValueOnce("without-access-uuid");

    const waiterResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "1234567891011",
        password: "12345678",
        accessLevel: 5,
      });

    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "12345678",
    });

    const listBillResponse = await request(app)
      .get("/bills/uuid")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`);

    expect(listBillResponse.status).toBe(401);
    expect(listBillResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
  it("Should not be able to list one bill with unexistent id", async () => {
    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johnnydoe@email.com",
      password: "12345678",
    });

    const listOneBillResponse = await request(app)
      .get("/bills/unexistent-uuid")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`);

    expect(listOneBillResponse.status).toBe(404);
    expect(listOneBillResponse.body).toEqual(
      expect.objectContaining({
        message: "Bill not found",
      })
    );
  });
});
