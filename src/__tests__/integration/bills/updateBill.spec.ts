import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe(" UPDATE - /bills/:id ", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  const mockBillUpdate = {
    paid: true,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update one bill", async () => {

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

    const updateBillResponse = await request(app)
      .patch("/bills/1")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`)
      .send(mockBillUpdate);

    expect(updateBillResponse.status).toBe(200);
    expect(updateBillResponse.body).toMatchObject({
      message: "Bill updated",
      bill: { ...billResponse.body.bill, paid: true },
    });
  });

  it("Should not be able to update one bill with accessLevel greater than 3", async () => {

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

    const billResponse = await request(app)
      .post("/bills")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);
    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "12345678",
    });

    const updateBillResponse = await request(app)
      .patch("/bills/1")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`)
      .send(mockBillUpdate);

    expect(updateBillResponse.status).toBe(401);
    expect(updateBillResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
  it("Should not be able to update one bill with unexistent id", async () => {
    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johnnydoe@email.com",
      password: "12345678",
    });

    const updateBillResponse = await request(app)
      .patch("/bills/3")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`);

    expect(updateBillResponse.status).toBe(404);
    expect(updateBillResponse.body).toEqual(
      expect.objectContaining({
        message: "Bill not found",
      })
    );
  });
});