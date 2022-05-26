import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe("POST - /categories", () => {
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

  const mockCategory = {
    name: "bebidas",
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to create an category", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const categoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockCategory);

    expect(categoryResponse.status).toBe(201);
    expect(categoryResponse.body).toMatchObject({
      message: "Category created",
      category: {
        ...categoryResponse.body.category,
        name: "bebidas",
      },
    });
  });
  it("Should not be able to create an category with repeated name", async () => {

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const categoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockCategory);

    expect(categoryResponse.status).toBe(409);
    expect(categoryResponse.body).toEqual(
      expect.objectContaining({
        message: "Category already exists",
      })
    );
  });
  it("Should not be able to create an category without sending accessLevel 1 or 2", async () => {

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const withoutAccessUser = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "999999999999",
        password: "S3nh@F0rt3",
        accessLevel: 3,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "S3nh@F0rt3",
    });

    const categoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`)
      .send({ name: "veganos" });

    expect(categoryResponse.status).toBe(401);
    expect(categoryResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
});
