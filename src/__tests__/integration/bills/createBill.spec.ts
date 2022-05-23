import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe("POST - /bills", () => {
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

  it("Should be able to create an bill", async () => {
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

    const billResponse = await request(app)
      .post("/bills")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`);

    expect(billResponse.status).toBe(201);
    expect(billResponse.body).toMatchObject({
      message: "Bill created",
      bill: {
        id: 1,
        paid: false,
        total: 0.0,
        orders: [],
      },
    });
  });
  it("Should not be able to create an bill with accessLevel greater than 3", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    const waiterResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "1234567891011",
        password: "12345678",
        accessLevel: 4,
      });

    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "12345678",
    });

    const billResponse = await request(app)
      .post("/bills")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`);

    expect(billResponse.status).toBe(401);
    expect(billResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
});
