import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

describe("POST - /categories", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  const mockCategory = {
    name: "massas",
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to create an category", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValueOnce("super-uuid");

    await request(app).post("/super").send({
      name: "testaurant",
      email: "admin@email.com",
      phone: "+55061940028922",
      password: "S3nh@F0rt3",
    });

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    console.log(adminLoginResponse);

    uuidSpy.mockReturnValueOnce("uuid");
    const categoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockCategory);

    expect(categoryResponse.status).toBe(201);
    expect(categoryResponse.body).toMatchObject({
      message: "Category Created",
      category: {
        id: "uuid",
        name: "Bebidas",
      },
    });
  });
  it("Should not be able to create an category with repeated name", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    uuidSpy.mockReturnValueOnce("uuid");
    const categoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockCategory);

    expect(categoryResponse.status).toBe(409);
    expect(categoryResponse.body).toEqual(
      expect.objectContaining({
        message: "Category with this name already exists",
      })
    );
  });
  it("Should not be able to create an category without sending accessLevel 1 or 2", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    uuidSpy.mockReturnValueOnce("without-access-uuid");
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

    uuidSpy.mockReturnValueOnce("uuid");
    const categoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ name: "veganos" });

    expect(categoryResponse.status).toBe(401);
    expect(categoryResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
});
