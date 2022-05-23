import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe(" DELETE - /bills/:id ", () => {
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

  it("Should be able to delete one bill", async () => {

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

    const delOneBillResponse = await request(app)
      .delete("/bills/1")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`);

    expect(delOneBillResponse.status).toBe(200);
    expect(delOneBillResponse.body).toHaveLength(0);
    expect(
      (
        await request(app)
          .delete("/bills/uuid")
          .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`)
      ).status
    ).toBe(404);
  });

  it("Should not be able to delete bill with accessLevel greater than 3", async () => {
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
        phone: "999999999999",
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

    const delCategoriesResponse = await request(app)
      .delete("/bills/2")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`);

    expect(delCategoriesResponse.status).toBe(401);
    expect(delCategoriesResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
  it("Should not be able to delete one bill with unexistent id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    const delOneBillResponse = await request(app)
      .delete("/bills/9")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delOneBillResponse.status).toBe(404);
    expect(delOneBillResponse.body).toEqual(
      expect.objectContaining({
        message: "Bill not found",
      })
    );
  });
});
