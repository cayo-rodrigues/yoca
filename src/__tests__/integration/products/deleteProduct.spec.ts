import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

describe(" DELETE - /products/:id ", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  const mockIngredient = {
    name: "Cenoura",
    measure: "kg",
    amount: 50,
    amountMax: 100,
    amountMin: 15,
  };

  const mockProduct = {
    name: "Pizza",
    price: 4.99,
    calories: 300,
    ingredients: [{ ingredientId: "uuid", amount: "100" }],
    categories: ["massas"],
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to delete an existing product", async () => {
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

    uuidSpy.mockReturnValueOnce("massas-uuid");
    await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "massas",
      });

    uuidSpy.mockReturnValueOnce("uuid");
    await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);

    uuidSpy.mockReturnValueOnce("uuid");
    const createProductResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockProduct);

    const delProductResponse = await request(app)
      .delete("/products/uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delProductResponse.status).toBe(200);
    expect(delProductResponse.body).toHaveLength(0);
    expect(
      (
        await request(app)
          .delete("/products/uuid")
          .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      ).status
    ).toBe(404);
  });
  it("Should not be able to delete an existing product without sending accessLevel 1 or 2", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    uuidSpy.mockReturnValueOnce("some-uuid");

    await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Batatão",
        price: 4.99,
        calories: 300,
        ingredients: [{ ingredientId: "uuid", amount: "100" }],
        categories: ["iguarias"],
      });

    uuidSpy.mockReturnValueOnce("some-uuid");
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

    const delProductResponse = await request(app)
      .delete("/products/some-uuid")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(delProductResponse.status).toBe(401);
    expect(delProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
});
