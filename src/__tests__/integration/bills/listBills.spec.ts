import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { TESTS_PASSWORD } from "../../../utils";

describe(" GET - /bills ", () => {
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
      password: TESTS_PASSWORD,
    });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to list all bills", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const waiterResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Johnny doe",
        email: "johnnydoe@email.com",
        phone: "1234567891011",
        password: TESTS_PASSWORD,
        accessLevel: 3,
      });

    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johnnydoe@email.com",
      password: TESTS_PASSWORD,
    });

    const billResponse = await request(app)
      .post("/bills")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`);

    const listBillResponse = await request(app)
      .get("/bills")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`);

    expect(listBillResponse.status).toBe(200);
    expect(listBillResponse.body.results).toHaveProperty("reduce");
  });

  it("Should not be able to list bills with accessLevel greater than 4", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const waiterResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "1234567891011",
        password: TESTS_PASSWORD,
        accessLevel: 5,
      });

    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: TESTS_PASSWORD,
    });

    const listBillResponse = await request(app)
      .get("/bills")
      .set("Authorization", `Bearer ${waiterLoginResponse.body}`);

    expect(listBillResponse.status).toBe(401);
    expect(listBillResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
});
