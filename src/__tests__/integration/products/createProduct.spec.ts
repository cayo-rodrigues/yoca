import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { TESTS_PASSWORD } from "../../../utils";

import * as uuid from "uuid";
jest.mock("uuid");

describe("POST - /products", () => {
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

  it("Should be able to create a product", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValueOnce("super-uuid");

    await request(app).post("/super").send({
      name: "testaurat",
      email: "admin@email.com",
      phone: "+55061940028922",
      password: TESTS_PASSWORD,
    });

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
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

    expect(createProductResponse.status).toBe(201);
    expect(createProductResponse.body).toMatchObject({
      message: "Product created",
      product: {
        id: "uuid",
        ...mockProduct,
      },
    });
  });
  it("Should not be able to create a product without sending accessLevel 1 or 2", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    uuidSpy.mockReturnValueOnce("without-access-uuid");
    const withoutAccessUser = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "999999999999",
        password: TESTS_PASSWORD,
        accessLevel: 3,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: TESTS_PASSWORD,
    });

    uuidSpy.mockReturnValueOnce("potato-uuid");

    const createProductResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`)
      .send({
        name: "Batatão recheado com cenoura",
        price: 4.99,
        calories: 300,
        ingredients: [{ ingredientId: "uuid", amount: "100" }],
        categories: ["massas"],
      });

    expect(createProductResponse.status).toBe(401);
    expect(createProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
  it("Should not be able to create a product with repeated name", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const createProductResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockProduct);

    expect(createProductResponse.status).toBe(409);
    expect(createProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Product with this name already exists",
      })
    );
  });
  it("Should not be able to create a product with unexistent ingredient", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const createProductResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Batatão",
        price: 4.99,
        calories: 300,
        ingredients: [{ ingredientId: "uuid-batata", amount: "100" }],
        categories: ["massas"],
      });

    expect(createProductResponse.status).toBe(404);
    expect(createProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Ingredients does not exist",
      })
    );
  });
});
